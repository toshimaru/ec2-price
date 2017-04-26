var fetch = require('node-fetch');
var argv = require('minimist')(process.argv.slice(2));
var columnify = require('columnify');

const AWS_PRICE_JS_URL = 'https://a0.awsstatic.com/pricing/1/ec2/linux-od.min.js';

// help
if (argv.h || argv.help) {
  console.log('Usage:');
  console.log('  ec2-price [-r region] [-t type]');
  console.log();
  console.log('Options:');
  console.log('  -h, --help            help message');
  console.log('  -v, --verbose         prices with instance specs');
  console.log('      --version         version');
  console.log('  -r, --region [REGION] specify a region');
  console.log('  -t, --type [TYPE]     specify a type');
  console.log('  -j, --json            use JSON as an output format');
  process.exit();
}

// version
if (argv.version) {
  console.log('Version: ' + require('./package').version);
  process.exit();
}

// region
var _region = argv.r || argv.region;

// type
var _type = argv.t || argv.type;

// verbose
var _verbose = argv.v || argv.verbose;

// JSON format
var _json = argv.j || argv.json;

fetch(AWS_PRICE_JS_URL)
  .then(function(res) {
    return res.text();
  })
  .then(function(body) {
    var callback = function(obj) {
      var selected_region = (_region) ? obj.config.regions.filter(function(i) { return i.region == _region; }) : obj.config.regions;
      var _json_result = {regions: []};

      if (selected_region.length === 0) {
        console.error('Invalid region given');
        console.log();
        console.log('Available regions are:');
        obj.config.regions.forEach(function(i) { console.log(i.region); } );
        process.exit(1);
      }

      for (var region of selected_region) {
        var _region_data = {};
        if (_json) {
          _region_data['region'] = region.region;
        } else {
          console.log('REGION: ' + region.region);
          console.log('----------------------');
        }
        var price_data = [];

        for (var instanceType of region.instanceTypes) {
          for (var size of instanceType.sizes) {
            data = {};

            if(_type && size.size != _type) {
              continue;
            }

            if (_verbose) {
              data = {
                name: size.size,
                "v-CPU": size.vCPU,
                ECU: size.ECU,
                memory: size.memoryGiB,
                strorage: size.storageGB,
                price: size.valueColumns[0].prices.USD,
              };
            } else {
              data = {
                name: size.size,
                price: size.valueColumns[0].prices.USD,
              };
            }

            price_data.push(data);
          }
        }
        if (_json) {
          _region_data['instances'] = price_data;
          _json_result['regions'].push(_region_data)
        } else {
          console.log(columnify(price_data));
          console.log('');
        }
      }

      if (_json) {
        console.log(JSON.stringify(_json_result));
      }
    };

    eval(body); // callback function is called by `eval()`
  })
  .catch(function(e) {
    console.error(e);
    exit(1);
  });
