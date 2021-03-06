Backdraft.plugin("DataTable", function(plugin) {

  function cidMap(collection) {
    return collection.map(function(model) {
      return { cid : model.cid };
    });
  }

  {%= inline("src/plugins/data_table/column_config_generator.js") %}
  {%= inline("src/plugins/data_table/column_manager.js") %}
  {%= inline("src/plugins/data_table/selection_manager.js") %}
  {%= inline("src/plugins/data_table/lock_manager.js") %}
  {%= inline("src/plugins/data_table/column_type.js") %}
  {%= inline("src/plugins/data_table/filter_view.js") %}
  {%= inline("src/plugins/data_table/row.js") %}
  {%= inline("src/plugins/data_table/data_table.js") %}
  {%= inline("src/plugins/data_table/server_side_data_table.js") %}

  plugin.initializer(function(app) {

    {%= inline("src/plugins/data_table/bootstrap.js") %}
    {%= inline("src/plugins/data_table/dataTables.colReorder.js") %}

    app.view.dataTable = function(name, baseClassName, properties) {
      var baseClass;
      if (arguments.length === 2) {
        properties = baseClassName;
        baseClass = properties.serverSide ? ServerSideDataTable : LocalDataTable;
      } else {
        baseClass = app.Views[baseClassName];
      }

      app.Views[name] = baseClass.extend(properties);
      baseClass.finalize(name, app.Views[name], app.Views, app.view.dataTable.config, app.name);
    };

    app.view.dataTable.row = function(name, baseClassName, properties) {
      var baseClass = Row, renderers;
      if (arguments.length === 2) {
        properties = baseClassName;
      } else {
        baseClass = app.Views[baseClassName];
      }

      // special handling for inheritance of renderers
      properties.renderers = _.extend({}, baseClass.prototype.renderers, properties.renderers || {});

      app.Views[name] = baseClass.extend(properties);
      baseClass.finalize(name, app.Views[name], app.Views);
    };

    // storage for app wide configuration of the plugin
    app.view.dataTable.config = {
      columnTypes: []
    };

    app.view.dataTable.columnType = function(cb) {
      var columnType = new ColumnType();
      cb(columnType);
      app.view.dataTable.config.columnTypes.push(columnType);
    };

    // add standard column types
    {%= inline("src/plugins/data_table/column_types/bulk.js") %}
    {%= inline("src/plugins/data_table/column_types/base.js") %}
  });

});

