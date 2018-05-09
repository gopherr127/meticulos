import { Component, Element, Listen, State } from '@stencil/core';
declare var Chart: any;

@Component({
  tag: 'dashboard-report-panel'
})
export class DashboardReportPanel {

  @Element() el: any;
  @State() reportTitle: string = '<Report Title>';
  @State() isInEditMode: boolean;

  async componentWillLoad() {

    await getChart();
    this.isInEditMode = false;
  }

  async componentDidLoad() {

    await this.loadChart();
  }

  async loadChart() {

    var ctx = this.el.querySelector("#myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
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

  async handleSaveClick() {

    this.isInEditMode = false;
    await this.loadChart();
  }

  @Listen('ionChange')
  handleIonChange(event: any) {

    if (event && event.detail) {
      this.reportTitle = event.detail.value;
    }
  }

  render() {
    return [
      <ion-card>
        <ion-card-header no-padding>
          <ion-item>
            <ion-label>{ this.reportTitle }</ion-label>
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
            <ion-input debounce={500} value={ this.reportTitle }></ion-input>
          </ion-item>

          <ion-card-footer>
            <ion-buttons slot="end">
              <ion-button color="primary" fill="solid"
                          onClick={ () => this.handleSaveClick() }>
                Save
              </ion-button>
              <ion-button color="primary" fill="clear">Cancel</ion-button>
            </ion-buttons>
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