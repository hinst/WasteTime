const emlformat = require('eml-format')
const fs = require('fs')

export class InfoRow {
    title: string
    /** seconds */
    time: number
}

export class WeekInfo {
    startDate: Date
    projects: InfoRow[]
    languages: InfoRow[]
    editors: InfoRow[]
    systems: InfoRow[]
}

export class Stats {
    weeks: WeekInfo
    loadDir(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath: string = dir + '/' + file;
            if (filePath.endsWith('.eml')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                emlformat.read(fileContent, function(error, data) {
                    if (error) {
                        console.error(error);
                        return null;
                    }
                });
            }
        }
    }
}