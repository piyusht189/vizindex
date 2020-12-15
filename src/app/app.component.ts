import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as L from 'leaflet';
import { Options } from '@angular-slider/ngx-slider';
import { map, take } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";
import { HttpClient } from '@angular/common/http';
import { notifyService } from '../services/snotify';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  private map;
  closeResult: string;
  showGraph = false;
  counties = [];
  industries = [];
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  selectedItems = [];
  selectedItems2 = [];
  selectedItems_industries = [];
  dropdownSettings : IDropdownSettings = {
    singleSelection: true,
    idField: 'Key',
    textField: 'Desc',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };
  dropdownSettings2 : IDropdownSettings = {
    singleSelection: true,
    idField: 'Key',
    textField: 'Desc',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  dropdownSettings_industries : IDropdownSettings = {
    singleSelection: true,
    idField: 'key',
    textField: 'desc',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };
  height = 0

  value: number = 5;
  options: Options = {
    floor: 0,
    ceil: 10,
    showTicksValues: true,
    stepsArray: [
      {value: 1, legend: 'Q1'},
      {value: 2, legend: 'Q2'},
      {value: 3, legend: 'Q3'},
      {value: 4, legend: 'Q4'},
      {value: 5, legend: 'Q1'},
      {value: 6, legend: 'Q2'},
      {value: 7, legend: 'Q3'},
      {value: 8, legend: 'Q4'},
      {value: 9, legend: 'Q1'}
    ],
    showTicks: true,
  };
  constructor(private modalService: NgbModal, public http: HttpClient, public notify: notifyService, public spinner: NgxSpinnerService){

    
  }
  ngOnInit(){
    this.spinner.show();
    this.http.get('https://apps.bea.gov/api/data/?UserID=5AD9AF84-851D-4C9F-BB3D-FE0EB5759988&method=GetParameterValuesFiltered&datasetname%20=Regional&TargetParameter=GeoFips&TableName=CAINC4&LineCode=10&ResultFormat=json').pipe(map(data => {
      if(data['BEAAPI']){
        if(data['BEAAPI']['Results']){
          if(data['BEAAPI']['Results']['ParamValue']){
            this.counties = data['BEAAPI']['Results']['ParamValue'];
            this.http.get('https://apps.bea.gov/api/data/?&UserID=5AD9AF84-851D-4C9F-BB3D-FE0EB5759988&method=GetParameterValues&DataSetName=MNE&ParameterName=Industry&ResultFormat=json').pipe(map(data => {
              this.spinner.hide();
               if(data['BEAAPI']){
                 if(data['BEAAPI']['Results']){
                   if(data['BEAAPI']['Results']['ParamValue']){
                     this.industries = data['BEAAPI']['Results']['ParamValue'];
                   }else{
                     this.notify.onError("Error", "Error in api call");
                   }
                 }else{
                   this.notify.onError("Error", "Error in api call");
                 }
               }else{
                 this.notify.onError("Error", "Error in api call");
               }
            })).subscribe(result => {
            });
          }else{
            this.spinner.hide();
            this.notify.onError("Error", "Error in api call");
          }
        }else{
          this.spinner.hide();
          this.notify.onError("Error", "Error in api call");
        }
      }else{
        this.spinner.hide();
        this.notify.onError("Error", "Error in api call");
      }
   })).subscribe(result => {
   });


  
   
    
  }
  ngAfterViewInit(){
    this.initMap();
    this.height = $('.graphdiv').height();
  
    this.chartOptions = {
      series: [
        {
          name: "High - 2018",
          data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
          name: "Low - 2020",
          data: [12, 11, 14, 18, 17, 13, 13]
        }
      ],
      chart: {
        height: this.height-20,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Alabama Vs Texas",
        align: "center"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3"],
        title: {
          text: "Quarters"
        }
      },
      yaxis: {
        title: {
          text: "Billions of Dollars"
        },
        min: 5,
        max: 40
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
    setTimeout(() => {
      this.showGraph = true;
    },500)
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onItemSelect2(item: any) {
    console.log(item);
  }
  checker(){
    console.log(this.selectedItems, this.selectedItems)
    if(JSON.stringify(this.selectedItems) === JSON.stringify(this.selectedItems2)){
      this.selectedItems2 = [];
      this.notify.onError("Error","Both counties cannot be same!")
    }
  }
  onItemSelect_industries(item: any) {
    console.log(item);
  }
  initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 4
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      tiles.addTo(this.map);
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      
    });
  }
  
}
