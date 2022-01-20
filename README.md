An implementation of the [Framingham CVD risk score](https://en.wikipedia.org/wiki/Framingham_Risk_Score) with [DMN](https://drools.org/learn/dmn.html)

# Disclaimer
**Not medical advice. Always seek professional medical advice.**
The content on this repository is provided for informational purposes only and is not intended as a medical advice, or a substitute for the medical advice of a doctor/physician.

The content on this repository is intended only as a methodological exercise to translate a scientific paper publication into a standardised executable DMN model.

Model features and labels are modeled as expressed with consideration from the original paper; that is for inputs:
```
age, sex, high blood pressure, smoking, dyslipidemia, and diabetes
```
and for outputs:
```
Framingham score, CVD Risk [%], Heart age/vascular age [y]
```

# References

- [General Cardiovascular Risk Profile for Use in Primary Care, The Framingham Heart Study](https://www.ahajournals.org/doi/pdf/10.1161/CIRCULATIONAHA.107.699579)
- [Healthcare Analytics Made Simple, by Vikas Kumar, Packt Publishing, July 2018, ISBN: 9781787286702](https://www.packtpub.com/product/healthcare-analytics-made-simple/9781787286702)
- [Learn DMN](https://drools.org/learn/dmn.html)
- [BPM+Health](https://www.bpm-plus.org)

# Benchmark edition

## DMN execution

In development mode:

```sh
mvn quarkus:dev -DskipTests
```

Package and run locally

```sh
mvn package
java -Dquarkus.http.host=0.0.0.0 -jar target/quarkus-app/quarkus-run.jar 
```

Probe the decision:

```sh
curl -i -X POST http://localhost:8080/framingham \
-H "Content-Type: application/json" \
-d \
"  {
    \"age\": 61,
    \"Sex\": \"Women\",
    \"Smoker?\": true,
    \"Systolic blood pressure\": 124,
    \"On SBP treatment?\": false,
    \"Total Cholesterol\": 180,
    \"HDL Cholesterol\": 47,
    \"Diabetic?\": false
  }"
```

### Deploy in OpenShift

Build the image:

```sh
mvn clean package -Dquarkus.container-image.build=true -DskipTests
```

Create the app:

```sh
oc new-app --name=dmn-framingham-cvd-risk-score kogito-decision/dmn-framingham-cvd-risk-score:1.0-SNAPSHOT
```

Expose the service:

```sh
oc expose service/dmn-framingham-cvd-risk-score
```

## K6 load test

If you run K6 in a container make sure that the decision service hostname is visible from the container:
in `script.js`, change `thehost` accordingly. 

Launch the test in a container:

```sh
podman run -i --user root -v ./k6:/home/k6:Z loadimpact/k6 run script.js
```

### Deploy in OpenShift

Change the script to match the URL available in the target environment.

E.g. `const url = 'http://dmn-framingham-cvd-risk-score.kogito-decision.svc.cluster.local:8080/framingham';`

Deploy the script and lauch the job:

```sh
oc create configmap script --from-file=k6/script.js
oc create -f k6/test-job.yaml
```

Follow the script execution log:

```sh
oc logs -f --selector=job-name=k6-test
```

To change the script in the configmap:

```sh
oc edit configmap/script
```

Repeat the load test:

```sh
oc delete job/k6-test; oc create -f k6/test-job.yaml
```

Further information:

- [K6 load tool](https://k6.io/)
