import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 40,
  duration: '40s',
};

export default function () {

  const url = 'http://thehost:8080/framingham';
  //const url = 'http://dmn-framingham-cvd-risk-score.kogito-decision.svc.cluster.local:8080/framingham';
  const payload = [ `
  {
    "Age": 61,
    "Sex": "Women",
    "Smoker?": true,
    "Systolic blood pressure": 124,
    "On SBP treatment?": false,
    "Total Cholesterol": 180,
    "HDL Cholesterol": 47,
    "Diabetic?": false
  }
  `,`
  {
    "Age": 53,
    "Sex": "Men",
    "Smoker?": false,
    "Systolic blood pressure": 125,
    "On SBP treatment?": true,
    "Total Cholesterol": 161,
    "HDL Cholesterol": 55,
    "Diabetic?": true
  }`];

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
  };

  http.post(url, payload[0], params);
  http.post(url, payload[1], params);
}
