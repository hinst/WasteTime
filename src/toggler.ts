/** Toggler: only one of the items can be enabled at a time */
export class Toggler {
    items: {
        key: any;
        enabled: boolean;
    }[];
    constructor(keys: Array<any>) {
        this.items = keys.map(item => {
            return {key: item, enabled: false}
        });
    }
    toggle(key: any) {
        for (const item of this.items) {
            if (item.key == key) {
                item.enabled = !item.enabled;
            } else {
                item.enabled = false;
            }
        }
    }
    isEnabled(key: any): boolean {
        for (const item of this.items) {
            if (item.key == key) {
                return true;
            }
        }
        return false;
    }
}