var exportBtn = document.getElementById('export');
        var emailInput = document.getElementById('email');
        var emailList = document.getElementById('emails');
        var addEmailBtn = document.getElementById('addEmailBtn');
        var layerSelect = document.getElementById('layer-select');
        var exportMessage = document.getElementById('exportMessage');
        var mergeCheckbox = document.getElementById('merge-box');
        var projectionValue = document.getElementById('projection-value');
        var resolutionValue = document.getElementById('resolution-value');
        var fileFormat = document.getElementById('file-format');
        var emails = [];

        function formatEmailList(emails) {
            emailList.innerHTML = '';
            emailList.innerHTML = emails.map(function(email) {
                //es6 template string
                return `<li class="email">${email}<i class="delete">X</i></li>`;
            }).join('');
        }

        function addEmailToList(email) {
            emails.push(email);
            formatEmailList(emails);
            emailInput.value = '';
        }

        function deleteEmailFromList(emailIndex) {
            emails.splice(emailIndex, 1);
            formatEmailList(emails);
        }
        
        function clearEmailsFromList() {
            emails = [];
            formatEmailList(emails);
        }

        new DroneDeploy({
                version: 1
            })
            .then(function(dronedeployApi) {
                dronedeployApi.User.get().then(user => addEmailToList(user.email))
                emailList.addEventListener('click', function(event) {
                    if (event.target && event.target.matches('i.delete')) {
                        var index = emails.indexOf(event.target.value);
                        deleteEmailFromList(index);
                    }
                })
                exportBtn.addEventListener('click', function(event) {
                    event.preventDefault();


                    dronedeployApi.Exporter.send({
                            layer: layerSelect.value,
                            email: emails,
                            
                            file_format: 'geotiff',
                            merge: mergeCheckbox.checked ? true : false,
                            projection: projectionValue.value,
                            planId: '5968d2856cbda58f3fb0fade',
                            resolution: resolutionValue.value === 0 ? 'native' : resolutionValue.value,
                            //url: ['https://requestb.in/smbtfbsm'],
                            /*webhook: {
                                url: 'https://requestb.in/smbtfbsm'
                            }*/
                        })
                    
                        .then(function(exportId) {
                                dronedeployApi.Messaging.showToast('Export successful!', {
                                    timeout: -1
                                });
                            },
                            function(error) {
                                dronedeployApi.Messaging.showToast(error, {
                                    timeout: -1
                                });
                            }
                        );
                });

                addEmailBtn.addEventListener('click', function(event) {
                    var newEmail = emailInput.value;
                    addEmailToList(newEmail);
                });

                clearEmailBtn.addEventListener('click', function(event) {
                    clearEmailsFromList();
                });
            });