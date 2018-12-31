/** For NPM package "eml-format" */
export class EmlData {
    subject: string
    from: string
    to: string
    headers: {[key: string]: string}
    html: string
    text: string
    attachments: Object[]
}