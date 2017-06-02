import { Component, Pipe, PipeTransform, Input } from '@angular/core';
declare var $: any;

export class Card {
    public price: number;
    public name: string;
    public set: string;

    constructor(set: string, name: string) {
        this.set = set;
        this.name = name;
        this.price = 0;
    }

    GetUrl() : string {
        return encodeURI('https://www.mtggoldfish.com/price/' + this.set + '/' + this.name.replace('/', '+') + '#online');
    }

    ParsePageForPrice(html: string) {
        var re = /<div class='price-box-price'>([0-9\.]+)<\/div>/;
        var matches = html.match(re);
        if (matches) {
            this.price = Number(matches[1]);
        }
        else {
            this.price = 0;
            console.log('No price for ' + this.name);
        }
    }

    GetPrice() {
        var self = this;
        $.get('/GetPrice?url=' + self.GetUrl(), function (data: any) {
            self.ParsePageForPrice(data);
        });
    }
}

@Pipe({
    name: 'priceFilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter(item => item.price > filter);
    }
}

///
/// Card set model class.
///
export class CardSet {
    public abbr: string;
    public name: string;
    public cards: Array<any>;
    public is_loaded: boolean;

    constructor(abbr: string) {
        this.abbr = abbr;
        this.cards = [];
        this.is_loaded = false;
    }

    Load() {
        var self = this;
        if (self.cards.length == 0) {
            $.ajax({
                url: 'https://mtgjson.com/json/' + this.abbr + '.json',
                success: function (data: any) {
                    self.name = data.name;
                    for (var i = 0; i < data.cards.length; ++i) {
                        self.cards.push(data.cards[i].name);
                    }
                    console.log('Loaded ' + self.abbr);
                    self.is_loaded = true;
                }
            });
        }
    }
}

///
/// Card set render class.
///
@Component({
    selector: 'card-set',
    template: `
    <li>
        {{ set.name }} ({{ set.abbr }}) - {{ set.is_loaded ? 'Loaded' : 'Not Loaded' }} <span (click)="Toggle()">Open</span>
        <div [ngClass]="{'hide': isShow == false}">
            {{ set.name }}<br/>
            {{ set.abbr }}<br/>   
        </div>
    </li>`
})
export class CardSetRender {
    @Input() set: CardSet;
    public isShow: boolean = false;

    Toggle() {
        this.isShow = !this.isShow;
    }
}

///
/// Main app component.
///
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    cards = new Array<Card>();
    sets = ['AKH', 'AER', 'KLD', 'SOI', 'EMN', 'W16', 'CHK', 'BOK', 'SOK'];
    set_data = new Array<CardSet>();
    sets_loaded = false;

    LoadSetData(callback: Function) {
        if (this.set_data.length == 0) {
            for (var i = 0; i < this.sets.length; ++i) {
                var cs = new CardSet(this.sets[i]);
                cs.Load();
                this.set_data.push(cs);
            }
        }
        this.sets_loaded = true;
    }

    GetSetForCardName(name: any) {
        for (var i = 0; i < this.set_data.length; ++i) {
            for (var k = 0; k < this.set_data[i].cards.length; ++k) {
                if (this.set_data[i].cards[k] == name || (name.indexOf('/') > 0 && name.startsWith(this.set_data[i].cards[k]))) {
                    return this.set_data[i].name;
                }
            }
        }

        console.log("Could not find card " + name + ".");
        return "";
    }

    ParseFile(file: HTMLInputElement) {
        var self = this;
        self.cards = new Array<Card>();

        var reader = new FileReader();
        reader.onload = function (e : any) {
            var parser = new DOMParser();
            var xml = parser.parseFromString(e.target.result, "text/xml");
            var root : any = xml.childNodes[0];
            for (var i = 0; i < root.childNodes.length; ++i) {
                if (root.childNodes[i].hasAttribute && root.childNodes[i].hasAttribute('Name')) {
                    var name = root.childNodes[i].getAttribute('Name');
                    var c = new Card(self.GetSetForCardName(name), name);
                    c.GetPrice();
                    self.cards.push(c);
                }
            }
        };
        reader.readAsText(file.files[0]);
    }
}

@Pipe({
    //The @Pipe decorator takes an object with a name property whose value is the pipe name that we'll use within a template expression. It must be a valid JavaScript identifier. Our pipe's name is orderby.
    name: "orderby"
})
export class OrderByPipe implements PipeTransform {
    transform(array: Array<any>, args? : any) {
        // Check if array exists, in this case array contains articles and args is an array that has 1 element : !id
        if (array) {
            // get the first element
            let orderByValue = args;
            let byVal = 1
            // check if exclamation point 
            if (orderByValue.charAt(0) == "!") {
                // reverse the array
                byVal = -1
                orderByValue = orderByValue.substring(1)
            }

            array.sort((a: any, b: any) => {
                if (a[orderByValue] < b[orderByValue]) {
                    return -1 * byVal;
                } else if (a[orderByValue] > b[orderByValue]) {
                    return 1 * byVal;
                } else {
                    return 0;
                }
            });
            return array;
        }
        //
    }
}