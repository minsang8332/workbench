export class Passcode implements IPasscode {
    text: string
    active: boolean
    constructor({ text = '', active = false }: IPasscode) {
        this.text = text
        this.active = active
    }
}
