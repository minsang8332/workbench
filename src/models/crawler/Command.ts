import { CRAWLER_COMMAND } from '@/constants/model'
import type { Crawler } from '@/types/model'

export class BaseCommand implements Crawler.Command.IBase {
    name: Crawler.Command.IBase['name']
    constructor(name: CRAWLER_COMMAND) {
        this.name = name
    }
}

export class RedirectCommand extends BaseCommand implements Crawler.Command.IRedirect {
    url: Crawler.Command.IRedirect['url']
    timeout: Crawler.Command.IRedirect['timeout']
    constructor(
        url: string,
        {
            timeout = 5000,
        }: {
            timeout?: number
        } = {}
    ) {
        super(CRAWLER_COMMAND.REDIRECT)
        this.url = url
        this.timeout = timeout
    }
}

export class ClickCommand extends BaseCommand implements Crawler.Command.IClick {
    selector: Crawler.Command.IClick['selector']
    timeout: Crawler.Command.IClick['timeout']
    pointer?: number
    constructor(
        selector: string,
        {
            timeout = 5000,
            pointer,
        }: {
            timeout?: number
            pointer?: number
        } = {}
    ) {
        super(CRAWLER_COMMAND.CLICK)
        this.selector = selector
        this.timeout = timeout
        this.pointer = pointer
    }
}

export class WriteCommand extends BaseCommand implements Crawler.Command.IWrite {
    selector: Crawler.Command.IWrite['selector']
    text: Crawler.Command.IWrite['text']
    timeout: Crawler.Command.IWrite['timeout']
    pointer?: number
    constructor(
        selector: string,
        text: string,
        {
            timeout = 5000,
            pointer,
        }: {
            timeout?: number
            pointer?: number
        } = {}
    ) {
        super(CRAWLER_COMMAND.WRITE)
        this.selector = selector
        this.text = text
        this.timeout = timeout
        this.pointer = pointer
    }
}

export class CursorCommand extends BaseCommand implements Crawler.Command.ICursor {
    constructor() {
        super(CRAWLER_COMMAND.CURSOR)
    }
}
