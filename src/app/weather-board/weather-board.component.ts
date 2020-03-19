import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Titlecolor } from './titlecolor';
import { WeatherBoardService } from './weather-board.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-weather-board',
  templateUrl: './weather-board.component.html',
  styleUrls: ['./weather-board.component.css']
})
export class WeatherBoardComponent implements OnInit {

  public errormsg: string = "";
  public countDate;
  public range: string = "";
  public date;
  public allDate = [];
  public items = new Array<Titlecolor>(12);
  public kpi: any[] = [
    { name: 'TempHighF', value: 'TempHighF', checked: false, index: 1 },
    { name: 'TempLowF', value: 'TempLowF', checked: false, index: 3 },
    { name: 'TempAvgF', value: 'TempAvgF', checked: false, index: 2 },
    { name: 'WindHighMPH', value: 'WindHighMPH', checked: false, index: 4 },
    { name: 'WindAvgMPH', value: 'WindAvgMPH', checked: false, index: 5 },
    { name: 'WindGustMPH', value: 'WindGustMPH', checked: false, index: 6 }
  ]
  public toggle: boolean = false;
  public selected: number = 0;
  public currentColor: string = "defaultb";
  public clicked: boolean = false;
  public kpiValue: string = "";
  public selectedDate: string = "";
  public boxTitle: string = "";
  public inner: HTMLCollection = document.getElementsByClassName("inner");
  public color: string = "default";
  public response = [];
  public header = [];
  public data = []
  public reader = new FileReader();
  public visualBtnText: string = "Show Chart";
  @ViewChild('title', { static: false }) weatherTitle: ElementRef;
  public subtitle: string = "";
  public toggleColor: boolean = false;

  constructor(private weatherBoardService: WeatherBoardService) {
  }

  ngOnInit() {
    this.weatherBoardService.readCsvData().subscribe(data => {
      this.response = data.split("\n");
      this.header = this.response[0].split(',').filter(word => {
        return word === 'Date' || word === 'TempHighF' || word === 'TempLowF' || word === 'TempAvgF' ||
          word === 'WindHighMPH' || word === 'WindAvgMPH' || word === 'WindGustMPH'
      })

      for (let i = 1; i < this.response.length; i++) {
        this.allDate.push(this.response[i].split(',').filter((word, i) => {
          return i === 0 || i === 1 || i === 2 || i === 3 ||
            i === 16 || i === 17 || i === 18;
        }));
      }

    });
  }

  ngAfterViewInit() {
    document.getElementsByClassName("inner")[0].setAttribute("style", "border: 1px solid rgb(20, 97, 212);");
  }

  test() {
  }

  drop(event: CdkDragDrop<any>) {
    this.items[event.previousContainer.data.index] = event.container.data.item
    this.items[event.container.data.index] = event.previousContainer.data.item
  }

  changeMenu = () => {

    this.toggle = this.clicked ? true : !this.toggle;

    if (this.toggle) {
      document.getElementById("side").style.width = "48%";
      document.getElementById("side").style.opacity = "1";
      document.getElementsByClassName("categories")[0].setAttribute("style", "width: 51%");
      this.clicked = false;
    } else {
      this.removeEffect();
      document.getElementById("side").style.width = "0";
      document.getElementById("side").style.opacity = "0";
      document.getElementsByClassName("categories")[0].setAttribute("style", "width: 100%");
    }
  }

  selectWeather = (num: number) => {
    this.selected = num;

    this.backToDefault();

    if (this.items[this.selected]) {
      this.selectedDate = this.items[this.selected].date;
      this.kpiValue = this.items[this.selected].kpi;
      this.kpi.forEach(each => {
        if (each.name === this.kpiValue) {
          each.checked = true;
        }
      })
    } else {
      this.selectedDate = "";
      this.kpiValue = "";
    }
    this.clicked = true;

    if (this.clicked) {

      this.removeEffect();
      this.inner[this.selected].setAttribute("style", "border: 1px solid rgb(20, 97, 212)");
    } else {
      this.inner[0].setAttribute("style", "border: 1px solid rgb(20, 97, 212)");
    }
    // console.log(this.items[this.selected]);
    this.changeMenu();
  }

  backToDefault = () => {
    this.data = [];
    this.subtitle = "";
    if (this.visualBtnText === "Close Chart") {
      this.toggleChart();
    }
    this.range = "";

    this.kpi.forEach((each) => {
      each.checked = false;
    })
  }

  onKey(value: string) {
    this.removeEffect();
  }

  addTitle(title: string) {
    if ((this.selectedDate !== "" || (this.items[this.selected] && this.items[this.selected].date !== ""))
      && this.kpiValue !== "") {
      this.errormsg = "";
      let kpidata;
      this.selectedDate = this.items[this.selected] && this.items[this.selected].date ?
        this.items[this.selected].date : this.selectedDate;

      this.allDate.forEach(one => {
        if (one[0] === this.selectedDate) {
          let kindex;
          this.kpi.forEach((each, i) => {
            if (each.name === this.kpiValue) {
              kindex = each.index;
            }
          })
          kpidata = one[kindex];
        }
      })
      let titlecolor = new Titlecolor();
      if (this.items[this.selected]) {
        titlecolor.color = this.items[this.selected].color
        this.items[this.selected].all = "";
      }
      titlecolor.date = this.selectedDate;
      titlecolor.kpi = this.kpiValue;
      titlecolor.temp = kpidata;
      titlecolor.comment = title;
      titlecolor.all = this.selectedDate + " - " + this.kpiValue + " = " + kpidata + (title ? ": " + title : "");
      this.items[this.selected] = titlecolor;
      this.weatherTitle.nativeElement.value = "";

      this.removeEffect();
    } else {
      this.errormsg = "Please select KPI and Date";
    }
  }

  removeEffect = () => {
    for (let i = 0; i < this.inner.length; i++) {
      this.inner[i].setAttribute("style", "border: unset");
    }
  }

  detect = (index: number, event) => {
    this.kpiValue = event.target.value;
    if (event.target.checked) {
      this.kpi.forEach((each, i) => {
        each.checked = i !== index ? false : true;
      })
    }
    // console.log(this.items[this.selected]);
  }

  pickColor = (color: string) => {
    this.color = color;
    this.currentColor = color + "b";
    let titlecolor = this.items[this.selected] ? this.items[this.selected] : new Titlecolor();
    titlecolor.color = color + " boxTitle";

    this.items[this.selected] = titlecolor;
    let divs = document.getElementById("palette").children;

    for (let i = 0; i < divs.length; i++) {
      divs[i].setAttribute("style", "display: none; opacity: 0");
    }
    this.toggleColor = false;
    this.removeEffect();
  }

  pop = () => {
    let divs = document.getElementById("palette").children;
    this.toggleColor = !this.toggleColor;

    for (let i = 0; i < divs.length; i++) {
      if (this.toggleColor)
        divs[i].setAttribute("style", "display: inline-block; opacity: 1");
      else {
        divs[i].setAttribute("style", "display: none; opacity: 0");
      }
    }
  }

  toggleChart = () => {

    if (this.range !== "") {
      this.errormsg = "";
      let grids = document.getElementsByClassName("visualGrid");
      for (let i = 0; i < grids.length; i++) {
        if (this.visualBtnText === "Show Chart") {
          grids[i].setAttribute("style", "display: grid;")
        } else {
          grids[i].setAttribute("style", "display: none;")
        }
      }

      this.visualBtnText = this.visualBtnText === "Show Chart" ? "Close Chart" : "Show Chart";
    } else {
      this.errormsg = "Time Frame has to be selected";
    }
  }

  selectDate = (event) => {
    if (this.items[this.selected]) {
      this.items[this.selected].date = event.target.innerText;
    } else {
      this.selectedDate = event.target.innerText;
    }
    document.getElementById("selectedDate").style.opacity = "1";

    this.allDate.forEach((one, i) => {
      if (one[0] === this.selectedDate) {
        this.data.push(this.allDate[i]);
        i = this.allDate.length;
      }
    })

    let grids = document.getElementsByClassName("visualGrid");
    for (let i = 0; i < grids.length; i++) {
      grids[i].setAttribute("style", "display: none;")
    }
    this.visualBtnText = "Show Chart";

  }

  selectTime = (event) => {
    this.data = [];
    this.subtitle = event.target.innerText === "Yesterday" ? "Compared to " + event.target.innerText :
      event.target.innerText === "Week" || event.target.innerText === "Month" ? "For " + event.target.innerText
        : event.target.innerText === "Today" ? "For " + event.target.innerText : "";

    this.range = event.target.innerText;

    if (this.selectedDate !== "") {
      this.errormsg = "";
      let timerange = this.range === "Yesterday" ? -1 : this.range === "Week" ? 7 : this.range === "Month" ? 30 : 1;

      let index;
      this.allDate.forEach((one, i) => {
        if (one[0] === this.selectedDate) {
          index = i;
        }
      })
      if (timerange === 1) {
        this.data.push(this.allDate[index]);
      } else if (timerange === -1) {
        if (index !== 0) this.data.push(this.allDate[index - 1]);
        else this.errormsg = "Not enough data for yesterday (Click Show Chart anyways for available data)";
        this.data.push(this.allDate[index]);
      } else {
        if (index + timerange > this.allDate.length - 1) {
          timerange = this.allDate.length - 1 - index;
          this.errormsg = "Not enough data for " + this.range.toLocaleLowerCase() + " (Click Show Chart anyways for available data)";
        }
        for (let i = index; i < index + timerange; i++) {
          this.data.push(this.allDate[i]);
        }
      }
    } else {
      this.errormsg = "Date has not been chosen yet";
    }

    let grids = document.getElementsByClassName("visualGrid");
    for (let i = 0; i < grids.length; i++) {
      grids[i].setAttribute("style", "display: none;")
    }
    this.visualBtnText = "Show Chart";
  }

}
