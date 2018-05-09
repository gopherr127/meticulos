import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { DashboardPanel, Item } from '../../../interfaces/interfaces';
declare var Chart: any;

@Component({
  tag: 'dashboard-pane'
})
export class DashboardPane {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Event() panelDeleted: EventEmitter;
  @Prop() panelId: string;
  @State() panel: DashboardPanel;
  @State() isInEditMode: boolean = false;
  private items: Array<Item> = [];
  private dataLabels: Array<string> = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
  private dataPoints: Array<number> = [12, 19, 3, 5, 2, 3];
  private backgroundColors: Array<string> = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ];
  private borderColors: Array<string> = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];
  private chartTypes: Array<any> = [
    { id: 'bar', name: 'Bar'},
    { id: 'bubble', name: 'Bubble'},
    { id: 'doughnut', name: 'Doughnut'},
    { id: 'line', name: 'Line'},
    { id: 'pie', name: 'Pie'},
    { id: 'polarArea', name: 'Polar Area'},
    { id: 'radar', name: 'Radar'}
  ];

  async componentWillLoad() {

    await this.loadPanel();
    await getChart();
  }

  async loadPanel() {

    if (this.panelId && this.panelId != "000000000000000000000000") {

      let response = await fetch(
        this.apiBaseUrl + `/dashboardpanels/${this.panelId}`, { 
          method: "GET"
      });
      
      if (response.ok) {
  
        this.panel = await response.json();
      }
    }
    else {
      this.panel = {
        id: "000000000000000000000000",
        typeId: 'bar',
        title: 'New Chart',
        jsonQueryDocument: '{}'
      }
    }
  }

  async componentDidLoad() {

    await this.refreshReportPanel();
  }

  // This method will get called when modifying any @State variable
  async componentDidUpdate() {

    if (!this.isInEditMode) {
      this.refreshReportPanel();
    }
  }

  async loadItems() {

    let response = await fetch(
      this.apiBaseUrl + `/items/search?json=${this.panel.jsonQueryDocument}`, {
        method: "GET"
    });

    if (response.ok) {

      this.items = await response.json();
    }
  }

  async processQueryResults(): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      if (this.items) {

        this.dataLabels = [];
        this.dataPoints = [];
        var dictStatusCounts = {};
        for (let item of this.items) {
          if (!dictStatusCounts[item.workflowNode.name]) {
            dictStatusCounts[item.workflowNode.name] = 1;
          }
          else {
            dictStatusCounts[item.workflowNode.name]++;
          }
        }

        for (var key in dictStatusCounts) {
          this.dataLabels.push(key);
          this.dataPoints.push(dictStatusCounts[key]);
        }

        resolve(true);
      }
      else {
        reject('No items loaded.');
      }
    });
  }

  async loadChart() {

    var ctx = this.el.querySelector("#myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: this.panel.typeId,
      data: {
          labels: this.dataLabels,
          datasets: [{
              // label: this.dataKeyLabel,
              data: this.dataPoints,
              backgroundColor: this.backgroundColors,
              borderColor: this.borderColors,
              borderWidth: 1
          }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
    myChart;
  }

  async configureReportPanel() {

    this.isInEditMode = true;
  }

  async refreshReportPanel() {

    await this.loadItems();
    await this.processQueryResults();
    await this.loadChart();
  }

  async handleSaveClick() {

    let response: Response;

    if (this.panel.id === "000000000000000000000000") {

      response = await fetch(
        this.apiBaseUrl + "/dashboardpanels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.panel)
      });
    }
    else {

      response = await fetch(
        this.apiBaseUrl + `/dashboardpanels/${this.panelId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.panel)
      });
    }

    if (response.ok) {

      this.isInEditMode = false;
    }
  }

  async handleDeleteClick() {

    let response = await fetch(
      `${this.apiBaseUrl}/dashboardpanels/${this.panelId}`, {
        method: "DELETE"
    });

    if (response.ok) {

      this.panelDeleted.emit();
    }
  }

  async handleCancelClick() {

    this.isInEditMode = false;
  }

  @Listen('ionChange')
  handleIonChange(event: any) {

    if (event && event.detail) {
      switch (event.target.id) {
        case "reportTitle": {
          this.panel.title = event.detail.value;
          break;
        }
        case "chartTypeSelect": {
          this.panel.typeId = event.detail.value;
          break;
        }
        case "jsonQueryDocument" : {
          this.panel.jsonQueryDocument = event.detail.value;
          break;
        }
      }
    }
  }

  render() {
    return [
      <ion-card>
        <ion-card-header no-padding>
          <ion-item>
            <ion-label>{ this.panel.title }</ion-label>
            <ion-button slot="end" fill="clear"
                        style={{ display: this.isInEditMode ? 'none' : 'block' }}
                        onClick={ () => this.refreshReportPanel() }>
              <ion-icon slot="icon-only" name="refresh" color="tertiary"></ion-icon>
            </ion-button>
            <ion-button slot="end" fill="clear"
                        style={{ display: this.isInEditMode ? 'none' : 'block' }}
                        onClick={ () => this.configureReportPanel() }>
              <ion-icon slot="icon-only" name="settings" color="tertiary"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-card-header>
        { this.isInEditMode
        ?
        <ion-card-content>
          
          <ion-item>
            <ion-label>Title</ion-label>
            <ion-input id="reportTitle" debounce={500} value={ this.panel.title }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Chart Type</ion-label>
            <ion-select id="chartTypeSelect" placeholder="Select Chart Type" 
                        value={ this.panel.typeId }>
              { this.chartTypes.map(type => 
                <ion-select-option value={ type.id }>
                  { type.name }
                </ion-select-option>)}
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>JSON Query Document</ion-label>
            <ion-input id="jsonQueryDocument" debounce={500} 
                       value={ this.panel.jsonQueryDocument }></ion-input>
          </ion-item>

          <ion-card-footer>
            <ion-row>
              <ion-col>
                <ion-buttons slot="start">
                  <ion-button color="danger" fill="clear"
                              onClick={ () => this.handleDeleteClick() }>Delete</ion-button>
                </ion-buttons>
              </ion-col>
              <ion-col>
                <ion-buttons slot="end">
                  <ion-button color="primary" fill="solid"
                              onClick={ () => this.handleSaveClick() }>
                    Save
                  </ion-button>
                  <ion-button color="primary" fill="clear"
                              onClick={ () => this.handleCancelClick() }>Cancel</ion-button>
                </ion-buttons>
              </ion-col>
            </ion-row>
            
          </ion-card-footer>
        </ion-card-content>
        :
        <ion-card-content>

          <canvas id="myChart"></canvas>

        </ion-card-content>
        }
        
      </ion-card>
    ];
  }
}

function getChart(): Promise<any> {
  const win = window as any;
  const Chart = win.Chart;
  if (Chart) {
    return Promise.resolve(Chart);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const win = window as any;
      const Chart = win.Chart;
      if (Chart) {
        resolve(Chart);
      } else {
        reject('ChartJS not available');
      }
    };
  });
}