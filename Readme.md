# pl-printer-crawler

clone the repo and run on local:

```
docker-compose up -d
```

to build the docker image:
```
 docker build .
 ```

The endpoint is localhost:3001/checkwarranty/:serialNumber/:modelNumber

Where:

:serialNumber is required
:modelNumber is required

returns a html page with the printer warranty data

If error returns a json file

Good Luck :)
