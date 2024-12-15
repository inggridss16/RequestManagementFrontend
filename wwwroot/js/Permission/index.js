$(function () {
    Control.Init();
});

let Selector = {
    hdnDivisionId: "#hdn-division-id",
    hdnRoleId: "#hdn-role-id",
    hdnUserId: "#hdn-user-id",
    tblPermission: "#tbl-permission",
    btNewPermission: "#bt-new-permission",
}

let Control = {
    Init: function () {
        Control.Event();
        TablePermission.Init();
    },
    Event: function () {
        $(Selector.btNewPermission).off("click").on("click", function () {
            window.location.href = 'Permission/Details'
        });

    },

    
}

let Api = {
    UrlBase: $('#hdn-web-api-url').val() + "api/Permission/",

    TablePermission: function (userId, page, pageSize, onSuccess, onFailed) {
        let params = {
            userId: userId,
            page: page,
            pageSize: pageSize,
        };

        $.ajax({
            url: Api.UrlBase + "GetVwRoleMenuPermission",
            type: "GET",
            data: params,
        }).done(function (data) {
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (typeof onFailed === 'function') {
                onFailed(jqXHR.responseText);
            }
        });
    },
}

let TablePermission = {
    Table: {},

    Init: function () {
        TablePermission.Table = $(Selector.tblPermission).DataTable({
            "processing": true,
            "serverSide": true,
            "language": {
                "emptyTable": "No data available in table",
            },
            "ajax": function (data, callback, settings) {
                let userId = $(Selector.hdnUserId).val();
                let page = data.start / data.length + 1;
                let pageSize = data.length;

                Api.TablePermission(
                    userId,
                    page,
                    pageSize,
                    function (response) {
                        if (response) {
                            callback({
                                draw: data.draw,
                                recordsTotal: response.totalCount,
                                recordsFiltered: response.totalCount,
                                data: response.data
                            });
                        } else {
                            console.error("API error:", response);
                        }
                    }
                );
            },
            "filter": false,
            "ordering": false,
            "destroy": true,
            "scrollX": true,
            "autoWidth": false,
            "columns": [
                {
                    // NEW COLUMN: Action Buttons
                    data: null,
                    render: function (data, type, row) {
                        return '<button class="btn btn-sm btn-primary edit-permission-btn" data-id="' + row.id + '">Edit</button>'; // Example button
                    },
                },
                { data: "role" },
                { data: "menu" },
                {
                    data: "isCreate",
                    render: function (data, type, row) {
                        if (data === true && data) {
                            return "Yes"; 
                        }
                        else {
                            return "No";
                        }
                    }
                },
                {
                    data: "isRead",
                    render: function (data, type, row) {
                        if (data === true && data) {
                            return "Yes";
                        }
                        else {
                            return "No";
                        }
                    }
                },
                {
                    data: "isUpdate",
                    render: function (data, type, row) {
                        if (data === true && data) {
                            return "Yes";
                        }
                        else {
                            return "No";
                        }
                    }
                },
                {
                    data: "isDelete",
                    render: function (data, type, row) {
                        if (data === true && data) {
                            return "Yes";
                        }
                        else {
                            return "No";
                        }
                    }
                },
            ],
        });

        TablePermission.Event();
    },
    Reload: function () {
        TablePermission.Table.ajax.reload(null, false);
    },
    Export: function () {

    },
    Event: function () {
        $(Selector.tblPermission).on('click', '.edit-permission-btn', function () {
            let permissionId = $(this).data('id');
            window.location.href = `Permission/Details?id=${permissionId}`;
        });
    }
}