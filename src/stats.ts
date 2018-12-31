import { EmlData } from "./emlformat";

const emlformat = require('eml-format')
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
    projects: InfoRow[]
    languages: InfoRow[]
    editors: InfoRow[]
    systems: InfoRow[]
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

export class Stats {
    weeks: WeekInfo[]
    async loadDir(dir: string) {
        this.weeks = []
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath: string = dir + '/' + file;
            if (filePath.endsWith('.eml')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                await this.loadFile(fileContent);
            }
        }
    }
    private async loadFile(fileContent) {
        const promise = new Promise((resolve, reject) => {
            emlformat.read(fileContent, (error, data: EmlData) => {
                if (!error) {
                    this.loadEmail(data);
                    resolve();
                } else {
                    console.error(error);
                    reject(error);
                }
            });
        });
    }
    private loadEmail(data: EmlData) {
        if (data.subject.includes('WakaTime Weekly Summary')) {
            const date = extractDateFromSubject(data.subject)
            console.log(data.subject, '->', date);
            const weekInfo = new WeekInfo();
            weekInfo.subject = data.subject;
            weekInfo.startDate = date;
            this.weeks.push(weekInfo)
        }
    }
}