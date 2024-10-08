var apiService = angular.module('apiService', []);


apiService.factory('API', ['$location', 'Runs', 'Results', function($location, Runs, Results) {
    
    console.log('API service loaded');
    console.error('API service loaded');

    return {
        launchTest: function(url, settings) {
            //settings.domainsBlockOrAllow = "block";
            //settings.domains = "api.meexr.fr";
            var runObject = {
                url: url,
                screenshot: true,
                device: settings.device,
                waitForSelector: settings.waitForSelector,
                proxy: settings.proxy,
                cookie: settings.cookie,
                authUser: settings.authUser,
                authPass: settings.authPass,
                blockDomain: settings.blockDomain,
                allowedDomains: settings.allowedDomains,
                noExternals: settings.noExternals
            };

            console.log(settings);
            console.log(runObject);

            console.error(settings);
            console.error(runObject);
            
            if (settings.domainsBlockOrAllow === 'block') {
                runObject.blockDomain = this.parseDomains(settings.domains);
            } else if (settings.domainsBlockOrAllow === 'allow') {
                var allowedDomains = this.parseDomains(settings.domains);
                if (allowedDomains.length > 0) {
                    runObject.allowDomain = allowedDomains;
                } else {
                    runObject.noExternals = true;
                }
            }

            Runs.save(runObject, function(data) {
                $location.path('/queue/' + data.runId);
            }, function(response) {
                if (response.status === 429) {
                    alert('Too many requests, you reached the max number of requests allowed in 24h');
                } else if (response.status === 403) {
                    alert('This particular query was blocked due to spamming. If you think it\'s an error, please open an issue on GitHub.');
                } else {
                    alert('An error occured...');
                }
            });
        },

        relaunchTest: function(result) {
            this.launchTest(result.params.url, result.params.options);
        },

        parseDomains: function(textareaContent) {
            var lines = textareaContent.split('\n');
            
            function removeEmptyLines (line) {
                return line.trim() !== '';
            }

            // Remove empty lines
            return lines.filter(removeEmptyLines).join(',');
        }
    };

}]);