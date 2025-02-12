import React, {Component} from 'react';
import { Card, CardBody } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
// import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import colors, {hexToRgba} from '../utils/colors';

let palette = [
  colors.GREEN, colors.TURQUOISE, colors.LOCHINVAR, 
  colors.GULLGREY, colors.WINTERSUN, colors.SUMMERSUN, 
  colors.BROWN, colors.RUST, colors.VELVET, 
  colors.MOUNTBATTEN, colors.GHOST, colors.GREY,
];
let paletteRgba1 = palette.map(color=>hexToRgba(color,0.7));
let paletteRgba2 = palette.map(color=>hexToRgba(color,1.0));

const chartHeight = 250;

const barData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: '',
      backgroundColor: paletteRgba1,
      borderColor: paletteRgba1,
      borderWidth: 1,
      hoverBackgroundColor: paletteRgba2,
      hoverBorderColor: paletteRgba2,
      data: [65, 59, 80, 81, 56, 55, 40, 22, 37, 10, 20, 30],
    },
  ],
};

/*
const durationData = {
  labels: ['0:00','5:00','10:00','15:00','20:00','25:00','30:00'],
  datasets: [
    {
      label: '',
      backgroundColor: paletteRgba1,
      borderColor: paletteRgba1,
      borderWidth: 1,
      hoverBackgroundColor: paletteRgba2,
      hoverBorderColor: paletteRgba2,
      data: [0, 5, 30, 10, 25, 15, 3],
    },
  ],
};

const scoreData = {
  labels: [0,1,2,3,4,5],
  datasets: [
    {
      label: '',
      backgroundColor: paletteRgba1,
      borderColor: paletteRgba1,
      borderWidth: 1,
      hoverBackgroundColor: paletteRgba2,
      hoverBorderColor: paletteRgba2,
      data: [0, 5, 12, 15, 18, 11],
    },
  ],
};
*/

let options = {
  tooltips: {
    enabled: true,
  },
  maintainAspectRatio: false,
  title: {
  	display: true,
  	fontSize: 16,
  	fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  	fontColor: '#666666',
  	text: 'My title',
  },
  legend: {
  	display: false,
  },
  scales: {
     yAxes: [{
         ticks: { beginAtZero: true },
         scaleLabel: {
          display: true,
          labelString: 'Y text',
         },
         gridLines: { display:false },
     }],
     xAxes: [{
         scaleLabel: {
          display: false,
          labelString: 'X text',
         },
         gridLines: { display:false },
     }]
 }
};

class DataDetails extends Component {

	render(){

		let optsUser = JSON.parse(JSON.stringify(options));
    let optsRewards = JSON.parse(JSON.stringify(options));
    let optsDuration = JSON.parse(JSON.stringify(options));
    let optsScore = JSON.parse(JSON.stringify(options));

		optsUser.title.text = 'Learner';
    optsUser.scales.yAxes[0].scaleLabel.labelString = 'Learner';

    optsRewards.title.text = 'Rewards';
    optsRewards.scales.yAxes[0].scaleLabel.labelString = 'Rewards';

    optsScore.title.text = 'Average score from questions';
    optsScore.scales.yAxes[0].scaleLabel.labelString = 'Learner';
    optsScore.scales.xAxes[0].scaleLabel.display = true;
    optsScore.scales.xAxes[0].scaleLabel.labelString = 'Score';

    optsDuration.title.text = 'Average time spent with lesson';
    optsDuration.scales.yAxes[0].scaleLabel.labelString = 'Learner';
    optsDuration.scales.xAxes[0].scaleLabel.display = true;
    optsDuration.scales.xAxes[0].scaleLabel.labelString = 'Time [min:sec]';
    
    let learnerData = JSON.parse(JSON.stringify(barData));
    learnerData.labels = this.props.data.learnerPerWeek.map(e=>e.week.toLocaleDateString("en-US"));
    learnerData.datasets[0].data = this.props.data.learnerPerWeek.map(e=>e.learner);

    let tokenData = JSON.parse(JSON.stringify(barData));
    tokenData.labels = this.props.data.tokenPerWeek.map(e=>e.week.toLocaleDateString("en-US"));
    tokenData.datasets[0].data = this.props.data.tokenPerWeek.map(e=>e.token);

		return (
			<div>

        <h3 style={{marginBottom: '0px', marginTop: '30px'}}>
          {(this.props.data.idx===-1)
          ? ('Details for all lessons')
          : ('Details for lesson ' + this.props.data.title)
          }
        </h3>
        <hr style={{marginTop: '0px', borderColor: colors.GULLGREY}}/>

				<Card className='has-shadow marginBottom20'>
          <CardBody>
            <div className="chart-wrapper">
            	<center>
              	<Bar data={learnerData} options={optsUser} height={chartHeight} />
              </center>
            </div>
          </CardBody>
        </Card>

      {/*
				<Card className='has-shadow marginBottom20'>
          <CardBody>
            <div className="chart-wrapper">
            	<center>
              	<Bar data={tokenData} options={optsRewards} height={chartHeight} />
              </center>
            </div>
          </CardBody>
        </Card>
      */}
      
      {/*
        <Card className='has-shadow marginBottom20'>
          <CardBody>
            <div className="chart-wrapper">
              <center>
                <Bar data={scoreData} options={optsScore} height={chartHeight} />
              </center>
            </div>
          </CardBody>
        </Card>

        <Card className='has-shadow marginBottom20'>
          <CardBody>
            <div className="chart-wrapper">
              <center>
                <Bar data={durationData} options={optsDuration} height={chartHeight} />
              </center>
            </div>
          </CardBody>
        </Card>
      */}
			</div>
		)
	}
}

export default DataDetails;