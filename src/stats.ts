import { EmlData } from "./emlformat";
const HTMLParser = require('node-html-parser');

const mailparser = require('mailparser')
const fs = require('fs')

export class InfoRow {
    title: string
    /** seconds */
    time: number
}

export class WeekInfo {
    /** Subject of email letter  */
    subject: string
    startDate: Date
    totalDuration: number;
    projects: InfoRow[]
    languages: InfoRow[]
    editors: InfoRow[]
    systems: InfoRow[]
}

export class Stats {
    weeks: WeekInfo[]
    async loadDir(dir: string) {
        this.weeks = []
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath: string = dir + '/' + file;
            if (filePath.endsWith('.eml')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const data = await this.loadFile(fileContent);
                // fs.writeFileSync(filePath + '.html', data.html);
                // fs.writeFileSync(filePath + '.txt', data.text);
            }
        }
    }
    private async loadFile(fileContent): Promise<EmlData> {
        const promise = new Promise<EmlData>((resolve, reject) => {
            mailparser.simpleParser(fileContent, (error, data: EmlData) => {
                if (!error) {
                    this.loadEmail(data);
                    resolve(data);
                } else {
                    console.error(error);
                    reject(error);
                }
            });
        });
        return promise;
    }
    private loadEmail(data: EmlData) {
        if (data.subject.includes('WakaTime Weekly Summary')) {
            const date = extractDateFromSubject(data.subject)
            console.log(data.subject, '->', date);
            const weekInfo = parseTextContent(data.text);
            weekInfo.subject = data.subject;
            weekInfo.startDate = date;
            console.log(durationToText(weekInfo.totalDuration));
            this.weeks.push(weekInfo)
        }
    }
    get totalDuration() {
        let sum = 0;
        for (const week of this.weeks)
            sum += week.totalDuration;
        return sum;
    }
}

/** deprecated */
function parseContent(htmlString) {
    const tree = HTMLParser.parse(htmlString);
    const introTextNode = tree.querySelector('p');
    const introText = introTextNode.childNodes[0].rawText;
}

enum SectionType {
    starting,
    unknown,
    projects,
    languages,
}

function parseTextContent(textString: string): WeekInfo {
    const weekInfo = new WeekInfo();
    const lines = textString.split('\n').map(line => line.trim());
    let sectionType = SectionType.starting;
    for (const line of lines) {
        if (sectionType == SectionType.starting) {
            weekInfo.totalDuration = parseWakaDuration(line);
            sectionType = SectionType.unknown;
        }
    }
    return weekInfo;
}

function findMarkerIndex(marker: string, textParts: string[]) {
    for (var i = 0; i < textParts.length; i++) {
        if (textParts[i].startsWith(marker))
            return i;
    }
    return -1;
}

/** returns seconds */
function parseWakaDuration(text: string): number {
    const textParts = text.split(' ');
    let result = 0;
    const hourIndex = findMarkerIndex('hr', textParts);
    if (hourIndex > 0) {
        const hours = parseInt(textParts[hourIndex - 1]);
        result += hours * 60 * 60;
    }
    const minuteIndex = findMarkerIndex('min', textParts);
    if (minuteIndex > 0) {
        const minutes = parseInt(textParts[minuteIndex - 1]);
        result += minutes * 60;
    }
    const secondIndex = findMarkerIndex('sec', textParts);
    if (secondIndex > 0) {
        const seconds = parseInt(textParts[secondIndex - 1]);
        result += seconds;
    }
    return result;
}

function extractDateFromSubject(text: string) {
    let result = null;
    const desiredPosition = text.search(/for \d\d\d\d-\d\d-\d\d/);
    if (desiredPosition >= 0) {
        const dateTextPosition = desiredPosition + 4;
        const dateTextLength = '2010-12-25'.length;
        const dateText = text.substring(dateTextPosition, dateTextPosition + dateTextLength);
        const parts = dateText.split('-');
        if (parts.length == 3) {
            result = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0, 0);
        }
    }
    return result;
}

/** duration in seconds to human-readable text */
export function durationToText(duration: number): string {
    const hours = Math.floor(duration / (60 * 60));
    duration = duration % (60 * 60);

    const minutes = Math.floor(duration / 60);
    duration = duration % 60;

    const seconds = duration;

    let text = '';
    function add(value, unit) {
        if (value > 0)
            text += '' + value + unit + ' ';
    }
    add(hours, 'h')
    add(minutes, 'm')
    add(seconds, 's')
    if (text.length == 0)
        text = '0'
    return text;
}