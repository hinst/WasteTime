import { EmlData } from "./emlFormat";

const mailparser = require('mailparser')
const fs = require('fs')

export class InfoRow {
    title: string
    /** seconds */
    time: number
}

export class WeekInfo {
    constructor() {
    }
    /** Subject of email letter  */
    subject: string
    startDate: Date
    totalDuration: number = 0
    projects: InfoRow[] = []
    languages: InfoRow[] = []
    editors: InfoRow[] = []
    systems: InfoRow[] = []
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
            const weekInfo = parseTextContent(data.text);
            weekInfo.subject = data.subject;
            weekInfo.startDate = date;
            this.weeks.push(weekInfo)
        }
    }
    get totalDuration() {
        let sum = 0;
        for (const week of this.weeks)
            sum += week.totalDuration;
        return sum;
    }
    getTopProjects(): InfoRow[] {
        const projects: InfoRow[] = []
        for (const week of this.weeks) {
            for (const project of week.projects) {
                let targetProject = projects.find(p => p.title == project.title);
                if (targetProject == null) {
                    targetProject = new InfoRow();
                    targetProject.title = project.title;
                    projects.push(targetProject);
                }
                targetProject.time += project.time;
            }
        }
        return projects;
    }
}

enum SectionType {
    starting,
    unknown,
    projects,
    languages,
}

function pushIfDefined(array: Array<any>, item: any) {
    if (item != null)
        array.push(item);
}

function parseTextContent(textString: string): WeekInfo {
    const weekInfo = new WeekInfo();
    const lines = textString.split('\n').map(line => line.trim());
    let sectionType = SectionType.starting;
    for (const line of lines) {
        if (sectionType == SectionType.starting && line.length > 0) {
            weekInfo.totalDuration = parseWakaDuration(line);
            sectionType = SectionType.unknown;
        } else if (sectionType == SectionType.unknown) {
            if (line.startsWith("Projects"))
                sectionType = SectionType.projects;
            else if (line.startsWith("Languages"))
                sectionType = SectionType.languages;
        } else if (line.length == 0) {
            console.log('reset')
            sectionType = SectionType.unknown;
        } else if (sectionType == SectionType.projects) {
            pushIfDefined(weekInfo.projects, parseWakaInfoRow(line));
        } else if (sectionType == SectionType.languages) {
            pushIfDefined(weekInfo.languages, parseWakaInfoRow(line));
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
    const days = Math.floor(duration / (60*60*24));
    duration = duration % (60*60*24);

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
    add(days, 'd')
    add(hours, 'h')
    add(minutes, 'm')
    add(seconds, 's')
    if (text.length == 0)
        text = '0'
    return text
}

function parseWakaInfoRow(text: string): InfoRow {
    const parts = text.split(':').map(part => part.trim());
    if (parts.length >= 2) {
        const infoRow = new InfoRow();
        infoRow.title = parts[0];
        infoRow.time = parseWakaDuration(parts[1]);
        return infoRow;
    } else {
        return null;
    }
}
