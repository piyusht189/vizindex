import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as L from 'leaflet';
import { Options, ChangeContext } from '@angular-slider/ngx-slider';
import { map, take } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import * as RootReducer from "./app.reducers"
import * as ProjectActions from "./actions/project";
import * as moment from 'moment';
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
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { statesData } from './statesData';
import { state_mapper } from './state_mapper';
import { date_mapper } from './date_mapper';

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
var contxt
var geojson;
var info;
var legend;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  private map;
  closeResult: string;
  showGraph = false;
  states1 = [];
  states2 = [];
  all_states = [];
  industries = [];
  maxBounds = L.latLngBounds(
    L.latLng(26.970598, -127.811379), 
    L.latLng(45.023476, -55.705283), 
  );
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  selected_state1 = {Key: '', Desc: ''};
  selected_state2 = {Key: '', Desc: ''};
  selected_industries = {Key: '', Desc: ''};
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
    idField: 'Key',
    textField: 'Desc',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };
  height = 0

  slider_value: number = 15;
  options: Options = {
    floor: 0,
    ceil: 16,
    showTicksValues: true,
    stepsArray: [
      {value: 1, legend: '<span class="legend1">Q1</span><br><span class="legend2">2017<span>'},
      {value: 2, legend: '<span class="legend1">Q2</span><br><span class="legend2">2017<span>'},
      {value: 3, legend: '<span class="legend1">Q3</span><br><span class="legend2">2017<span>'},
      {value: 4, legend: '<span class="legend1">Q4</span><br><span class="legend2">2017<span>'},
      {value: 5, legend: '<span class="legend1">Q1</span><br><span class="legend2">2018<span>'},
      {value: 6, legend: '<span class="legend1">Q2</span><br><span class="legend2">2018<span>'},
      {value: 7, legend: '<span class="legend1">Q3</span><br><span class="legend2">2018<span>'},
      {value: 8, legend: '<span class="legend1">Q4</span><br><span class="legend2">2018<span>'},
      {value: 9, legend: '<span class="legend1">Q1</span><br><span class="legend2">2019<span>'},
      {value: 10, legend: '<span class="legend1">Q2</span><br><span class="legend2">2019<span>'},
      {value: 11, legend: '<span class="legend1">Q3</span><br><span class="legend2">2019<span>'},
      {value: 12, legend: '<span class="legend1">Q4</span><br><span class="legend2">2019<span>'},
      {value: 13, legend: '<span class="legend1">Q1</span><br><span class="legend2">2020<span>'},
      {value: 14, legend: '<span class="legend1">Q2</span><br><span class="legend2">2020<span>'},
      {value: 15, legend: '<span class="legend1">Q3</span><br><span class="legend2">2020<span>'},
    ],
    showTicks: true,
  };

  slider_vals = {
    1: "2017:Q1",
    2: "2017:Q2",
    3: "2017:Q3",
    4: "2017:Q4",
    5: "2018:Q1",
    6: "2018:Q2",
    7: "2018:Q3",
    8: "2018:Q4",
    9: "2019:Q1",
    10: "2019:Q2",
    11: "2019:Q3",
    12: "2019:Q4",
    13: "2020:Q1",
    14: "2020:Q2",
    15: "2020:Q3"

  }


  state_quart = "";
  state1_diff = 0;
  state2_diff = 0;

  sunscription_states: Subscription;


  state1_compare = '';
  state2_compare = '';
  industry_compare = '';

  industry_all_data = [];

  projection_type = "c";
  covid_data_all = [];
  f_time = 1;
  exceptions = ['District of Columbia', 'New England', 'Mideast', 'Great Lakes', 'Plains', 'Southeast', 'Southwest', 'Rocky Mountain', 'Far West', 'Alaska', 'Hawaii']
  constructor(public rootstore: Store<RootReducer.PState>,private modalService: NgbModal, public http: HttpClient, public notify: notifyService, public spinner: NgxSpinnerService){
    contxt = this;
    this.spinner.show();
    this.rootstore.dispatch(new ProjectActions.GetCovidData());
    this.rootstore.dispatch(new ProjectActions.GetIndustriesData());

  
      this.rootstore
      .select(state => state.industrial_data)
      .subscribe(data => {
          if(data.length){
            
              let states_checker = [];
              let states = [];
              let industries = [];

              this.industry_all_data = data;
              data.forEach((element, index) => {
                if (element.GeoFips) {
                    if(!states_checker.includes(element.GeoName) && !this.exceptions.includes(element.GeoName)){
                        states_checker.push(element.GeoName);
                        states.push({Key: element.GeoName, Desc: element.GeoName});
                    }
                    if(element.GeoFips === 1000){
                      industries.push({Key: element.Description.trim(), Desc: element.Description.trim()});
                    }
                }
            });

            //STATES
            this.states1 = states;
            this.states2 = states;
            this.all_states = states;


            //INDUSTRIES
            this.industries = industries;
          }
      });


       this.rootstore
      .select(state => state.covid_data)
      .subscribe(data => {
          if(data.length){

              //Map States
              let covid_state_changed = data.map(element => {
                      let assigner = JSON.parse(JSON.stringify(element)); 
                      assigner['state'] = state_mapper[element.state];
                      return assigner;
              });


              this.covid_data_all = covid_state_changed.filter(e => e['state']);

             
              

             this.calculateCovid();
            //  console.log("first", statesData.features.properties.name);

              
          }
      });
    
  }
  mergeArrayObjects(arr1,arr2){
  return arr1.map((item,i)=>{
     if(item.state === arr2[i].state){
         //merging two objects
       return Object.assign({},item,arr2[i])
     }
  })
}
  ngOnInit(){    
  }
  calculateCovid(arr?){
    let yearquarter = this.slider_vals[this.slider_value];
    let daterangeobj = date_mapper[yearquarter];
    let covid_data_prepare = this.covid_data_all.filter(e => moment(e['date']) >= moment(daterangeobj['from']) && moment(e['date']) <= moment(daterangeobj['to']));

    //console.log("Covid filtered", daterangeobj, yearquarter,  covid_data_prepare);
    
    let merged;
    if(arr){
      let merged_temp2 = JSON.parse(JSON.stringify(statesData));
      merged_temp2.features = merged_temp2.features.filter(e => e['properties']['name'] == arr[0] || e['properties']['name'] == arr[1])
      merged = merged_temp2;
    }else{
      merged = statesData;
    }
    merged.features = merged.features.map(e => {
       
          let statewise = covid_data_prepare.filter(e1 => e1['state'] == e['properties']['name']);
          let total_deaths = 0;
          let total_recovered = 0;
          let total_positive = 0;
          let total_tests_done = 0;
          statewise.forEach(e2 => {
            total_deaths = total_deaths + (e2.death ? e2.death : 0);
            total_recovered = total_recovered + (e2.recovered ? e2.recovered : 0);
            total_positive = total_positive + (e2.positive ? e2.positive : 0);
            total_tests_done = total_tests_done + (e2.totalTestResults ? e2.totalTestResults : 0);
          });
          e['properties']['total_deaths'] = total_deaths;
          e['properties']['total_recovered'] = total_recovered;
          e['properties']['total_positive'] = total_positive;
          e['properties']['total_tests_done'] = total_tests_done;
          if(arr){
            let statewise1 = this.industry_all_data.filter(e1 => e1['GeoName'].trim() == e['properties']['name'] && e1['Description'].trim() == this.selected_industries.Key);
            if(statewise1.length){
              e['properties']['revenue'] = statewise1[0][yearquarter];
            }
          }
        return e;
    })
    this.setupChoro(merged, arr);
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
   
  }
  onUserChangeEnd(changeContext: ChangeContext): void {
    //console.log("Changed to  ", changeContext.value);
    this.visualize();
  }
  visualize_covid(){
    this.state1_compare = '';
    this.state2_compare = '';
    this.industry_compare = '';
    this.projection_type = 'c';
    this.selected_state1 = {Key: '', Desc: ''};
    this.selected_state2 = {Key: '', Desc: ''};
    this.selected_industries = {Key: '', Desc: ''};
    this.calculateCovid();

  }
  visualize(){

    if(this.checker()){
        this.spinner.show();
        this.state1_compare = this.selected_state1.Key;
        this.state2_compare = this.selected_state2.Key;
        this.industry_compare = this.selected_industries.Key;
        let q_temp = this.slider_vals[this.slider_value].split(":");
        let prev = q_temp[0]-1; 
        this.state_quart =  prev + "(" + q_temp[1] + ") to " + q_temp[0] + "(" + q_temp[1] + ")";
        let comparee_obj1 =  this.getObj(this.state1_compare, this.industry_compare);
        let comparee_obj2 =  this.getObj(this.state2_compare, this.industry_compare);

        console.log("C1", comparee_obj1);
        console.log("C2", comparee_obj2);
        if(comparee_obj1 && comparee_obj2){
           //Enable Slider
           this.showGraph = true;


          let prev_quart1 = comparee_obj1[prev + ':' + q_temp[1]];
          let now_quart1 = comparee_obj1[q_temp[0] + ':' + q_temp[1]];
          this.state1_diff = parseFloat((((now_quart1 - prev_quart1)/prev_quart1) * 100).toFixed(2));
          let prev_quart2 = comparee_obj2[prev + ':' + q_temp[1]];
          let now_quart2 = comparee_obj2[q_temp[0] + ':' + q_temp[1]];
          this.state2_diff = parseFloat((((now_quart2 - prev_quart2)/prev_quart2) * 100).toFixed(2));

         this.spinner.hide();
         this.projection_type = 'i';
         this.calculateCovid([this.state1_compare, this.state2_compare]);
        }else{
          this.calculateCovid();
          this.spinner.hide();
          this.notify.onError("Error", "Something wrong with the data!");
        }
      }else{
        this.calculateCovid();
      }     

      
  }
  getObj(state,industry){
    let all_temp = this.industry_all_data.filter(e => { 
      return e['GeoName'].trim() == state && e['Description'].trim() == industry
    });
    return all_temp.length ? all_temp[0] : null;
  }
  onItemSelect(item: any) {
    console.log(item);
    this.selected_state1 = item;
    
  }
  onItemSelect2(item: any) {
    console.log(item);
    this.selected_state2 = item;
  }
  checker(){
    if(this.selected_state1.Key && this.selected_state2.Key && this.selected_industries.Key){
     if(JSON.stringify(this.selected_state1) === JSON.stringify(this.selected_state2)){
      this.notify.onError("Error","Both counties cannot be same!");
      return false;
     }else{
      return true;
     }
    }else{
      return false;
    }
    
  }
  onItemSelect_industries(item: any) {
    console.log(item);
    this.selected_industries = item;
  }
  initMap(): void {
    this.map = L.map('map', {
      'center': [0, 0],
      'zoom': 4,
      'maxBounds': this.maxBounds
    }).fitBounds(this.maxBounds);
     const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 7,
        minZoom: 4,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      tiles.addTo(this.map);


      
      


      //MAP BOUNDARIES
      setTimeout(() => {
        this.map.setMaxBounds(this.maxBounds);
        this.map.fitBounds(this.maxBounds);
        this.map.setZoom(4);
      },1000)
  }
  setupChoro(arr, arr1?){
    if(!this.f_time){
      contxt.map.removeLayer(geojson);
    }else{
      this.f_time = 0;
    }

    if(arr1){
      geojson = L.geoJson(arr, {style: contxt.style_ind, onEachFeature: contxt.onEachFeature}).addTo(this.map);
    }else{
      geojson = L.geoJson(arr, {style: contxt.style, onEachFeature: contxt.onEachFeature}).addTo(this.map);
    }
    

    $('.leaflet-right').find('.leaflet-control').remove();
    
    info = L.control();
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };
    
    // method that we will use to update the control based on feature properties passed
    if(arr1){
      info.update = function (props) {
        this._div.innerHTML = ('<h4>US Industrial Sectors & Covid Data</h4><h6>For ' + contxt.selected_industries.Key + '</h6>') +  (props ?
            '<b><h6>State: ' + props.name + '</h6></b>' + '<strong>$' + parseFloat(''+props.revenue).toFixed(2).toLocaleString() + ' billion net worth.</strong><br>' + props.total_positive.toLocaleString() + ' total positive cases.<br>' + props.total_deaths.toLocaleString() + ' total deaths.<br>' + props.total_recovered.toLocaleString() + ' total recoveries.<br>' + props.total_tests_done.toLocaleString() + ' total tests done.<br>'
            : 'Hover over a state');
       };
    }else{
      info.update = function (props) {
        this._div.innerHTML = ('<h4>US Quarterwise Covid Data</h4>') +  (props ?
            '<b><h6>State: ' + props.name + '</h6></b>' + props.total_positive.toLocaleString() + ' total positive cases.<br>' + props.total_deaths.toLocaleString() + ' total deaths.<br>' + props.total_recovered.toLocaleString() + ' total recoveries.<br>' + props.total_tests_done.toLocaleString() + ' total tests done.<br>'
            : 'Hover over a state');
      };
    }
   


    info.addTo(contxt.map);

    //LEGEND
    legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      if(arr1){
          var div = L.DomUtil.create('div', 'info legend'),
          grades = [0,3,4,5,6,7,8,9,10,11,12,13,14,15],
          labels = [];
      }else{
          var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10000, 30000, 50000, 70000, 1000000, 3000000, 5000000, 7000000, 10000000, 20000000, 30000000],
          labels = [];
      }
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        if(i == 0){
          if(arr1){
            div.innerHTML += '<strong>Net worth in billions($)</strong><br>';
          }else{
            div.innerHTML += '<strong>Positive Cases</strong><br>';
          }
        }
        if(arr1){
          div.innerHTML +=
          '<i style="background:' + contxt.getColor_Ind(grades[i] + 1) + '"></i> ' +
          grades[i].toLocaleString() + (grades[i + 1] ? '&ndash;' + grades[i + 1].toLocaleString() + '<br>' : '+');
        }else{
          div.innerHTML +=
              '<i style="background:' + contxt.getColor(grades[i] + 1) + '"></i> ' +
              grades[i].toLocaleString() + (grades[i + 1] ? '&ndash;' + grades[i + 1].toLocaleString() + '<br>' : '+');
        }
          
      }
  
      return  div;
    };
  
    legend.addTo(contxt.map);
  }
  getColor(d) {
    return d > 30000000 ? '#003945' :
           d > 20000000  ? '#015c6e' :
           d > 10000000  ? '#01738a' :
           d > 7000000  ? '#008aa6' :
           d > 5000000  ? '#029ebd' :
           d > 3000000   ? '#04b1d4' :
           d > 1000000   ? '#19c1e3' :
           d > 700000   ? '#39cfed' :
           d > 500000   ? '#39deed' :
           d > 300000   ? '#58e8f5' :
           d > 100000   ? '#75e6f0' :
           d > 70000   ? '#75eef0' :
           d > 50000   ? '#84f3f5' :
           d > 30000   ? '#95f3f5' :
           d > 10000   ? '#b3fdff' :
                      '#d1fdff';
  }
  getColor_Ind(d) {
    return d > 15  ? '#00080a' :
           d > 14  ? '#002229' :
           d > 13  ? '#003945' :
           d > 12   ? '#015c6e' :
           d > 11   ? '#029ebd' :
           d > 10   ? '#04b1d4' :
           d > 9   ? '#19c1e3' :
           d > 8   ? '#39cfed' :
           d > 7   ? '#39deed' :
           d > 6   ? '#58e8f5' :
           d > 5   ? '#75eef0' :
           d > 4   ? '#84f3f5' :
           d > 3   ? '#b3fdff' :
                      '#d1fdff';
  }
  style(feature) {
    return {
        fillColor: contxt.getColor(feature.properties.total_positive),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8
    };
  }
  style_ind(feature) {
    return {
        fillColor: contxt.getColor_Ind(feature.properties.revenue),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8
    };
  }
  highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
  }
  resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }
  zoomToFeature(e) {
    contxt.map.fitBounds(e.target.getBounds());
  }
  onEachFeature(feature, layer) {
    layer.on({
        mouseover: contxt.highlightFeature,
        mouseout: contxt.resetHighlight,
        click: contxt.zoomToFeature
    });
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      
    });
  }
  
}
