import { EmlData } from "./emlFormat";

const mailparser = require('mailparser');
const fs = require('fs');
import * as path from 'path';
const node_html_parser = require('node-html-parser');

export class InfoRow {
    title: string;
    /** seconds */
    time: number = 0;
}

export class WeekInfo {
    constructor() {
    }
    /** Subject of email letter  */
    subject: string;
    startDate: Date;
    totalDuration: number = 0;
    projects: InfoRow[] = [];
    languages: InfoRow[] = [];
    editors: InfoRow[] = [];
    systems: InfoRow[] = [];
}

export class Stats {
    weeks: WeekInfo[];
    async loadDir(dir: string) {
        this.weeks = [];
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath: string = dir + '/' + file;
            if (filePath.endsWith('.eml')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const data = await this.loadFile(filePath, fileContent);
                // fs.writeFileSync(filePath + '.html', data.html);
                // fs.writeFileSync(filePath + '.txt', data.text);
            }
        }
    }
    private async loadFile(filePath: string, fileContent): Promise<EmlData> {
        const promise = new Promise<EmlData>((resolve, reject) => {
            mailparser.simpleParser(fileContent, (error, data: EmlData) => {
                if (!error) {
                    this.loadEmail(filePath, data);
                    resolve(data);
                } else {
                    console.error(error);
                    reject(error);
                }
            });
        });
        return promise;
    }
    private loadEmail(filePath: string, data: EmlData) {
        if (data.subject.includes('WakaTime Weekly Summary')) {
            const date = extractDateFromSubject(data.subject);
            const weekInfo = parseTextContent(data.text);
            weekInfo.subject = data.subject;
            weekInfo.startDate = date;
            this.weeks.push(weekInfo);
        }
        if (data.subject.includes(' board')) {
            const fileName = path.basename(filePath);
            const date = extractDateFromFileName(fileName);
            parseLeaderboardHtmlContent(data.html);
        }
    }
    get totalDuration() {
        let sum = 0;
        for (const week of this.weeks)
            sum += week.totalDuration;
        return sum;
    }
    getTopProjects(): InfoRow[] {
        const projects: InfoRow[] = [];
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
        projects.sort((a, b) => -(a.time - b.time));
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

function extractDateFromSubject(text: string): Date {
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
export function durationToText(duration: number, useWorkingDay: boolean): string {
    const dayDivider = 60 * 60 * (useWorkingDay ? 8 : 24 );
    const days = Math.floor(duration / dayDivider);
    duration = duration % dayDivider;

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
    add(days, 'd');
    add(hours, 'h');
    add(minutes, 'm');
    add(seconds, 's');
    if (text.length == 0)
        text = '0';
    return text;
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

/** File names of files generated by e-mail exporter extension for Mozilla Thunderbird */
function extractDateFromFileName(fileName: string): Date {
    let result: Date = null;
    if (fileName.length >= 8) {
        const year = parseInt(fileName.substr(0, 4));
        const month = parseInt(fileName.substr(4, 2));
        const day = parseInt(fileName.substr(6, 2));
        result = new Date(year, month - 1, day);
    }
    return result;
}

function parseLeaderboardHtmlContent(textString: string): InfoRow[] {
    const document = node_html_parser.parse(textString);
    const tables = getAllTables(document);
    const infoRows: InfoRow[] = [];
    tables.forEach(table => {
        const matched = detectLeaderboardTable(table);
        if (matched) {
            const rows = getTableRows(table);
            for (let i = 1; i < rows.length; i++) {
                const cells = getRowCells(rows[i]);
                const infoRow = new InfoRow();
                infoRow.title = cells[LeaderboardColumns.keys.programmer.index].text.trim();
                const timeText = cells[LeaderboardColumns.keys.hoursCoded.index].text.trim();
                infoRow.time = parseWakaDuration(timeText);
                infoRows.push(infoRow);
            }
        }
    });
    return infoRows;
}

function getElementRows(element): [] {
    return element.childNodes.filter(node => node.tagName && node.tagName.toLowerCase() == "tr");
}

function checkNodeTagMatch(node, tags: string[]): boolean {
    const tagName: string = node.tagName ? node.tagName.toLowerCase() : null;
    return tags.some(tag => tag == tagName);
}

function getTableRows(tableElement) {
    const bodies = tableElement.childNodes.filter(node => checkNodeTagMatch(node, ['tbody', 'thead']));
    if (bodies.length) {
        const rows = [];
        bodies.forEach(body => {
            rows.push(...getElementRows(body));
        });
        return rows;
    } else {
        return getElementRows(tableElement);
    }
}

class LeaderboardColumn {
    constructor(title: string, index: number) {
        this.title = title;
        this.index = index;
    }
    title: string;
    index: number;
}

class LeaderboardColumns {
    static keys: { [key: string]: LeaderboardColumn} = {
        rank: new LeaderboardColumn("rank", 0),
        programmer: new LeaderboardColumn("programmer", 1),
        hoursCoded: new LeaderboardColumn("hours coded", 2),
    };
    static array: LeaderboardColumn[];
    static initialize() {
        this.array = [];
        for (const key in this.keys) {
            const column = this.keys[key];
            this.array[column.index] = column;
        }
    }
} LeaderboardColumns.initialize();

function getRowCells(rowElement) {
    return rowElement.childNodes.filter(node => checkNodeTagMatch(node, ['td', 'th']));
}

function detectLeaderboardTable(table) {
    const rows = getTableRows(table);
    if (rows.length > 0) {
        const headerRows = getRowCells(rows[0]);
        const getHeaderCell = i => headerRows[i].text.trim().toLowerCase();
        if (false && headerRows.length > 0)
            console.log(headerRows[0]);
        return headerRows.length >= 3 &&
            LeaderboardColumns.array.every((column, index) => getHeaderCell(index) == column.title);
    }
}

function getAllTables(document): any[] {
    const tables: any[] = document.querySelectorAll('table');
    tables.forEach(table => {
        tables.push(...getAllTables(table));
    });
    return tables;
}