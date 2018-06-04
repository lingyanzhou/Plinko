function PlinkoHistogram(id, game) {
  this.game = game;
  this.margin = {top: 10, right: 30, bottom: 30, left: 40};
  this.width = 600;
  this.height = 500;

  this.xScale = d3.scaleLinear()
            .domain([0, Game.WIDTH])
            .range([0, this.width]);
  this.yScale = d3.scaleLinear()
            .range([this.height, 0]);

  // set the parameters for the histogram
  this.histogramFunc = d3.histogram()
      .value(function(d) { return d.phxObj.position.x; })
      .domain(this.xScale.domain())
      .thresholds(d3.range(0, 400, 50));
      //.thresholds(this.xScale.ticks(Game.PEG_HINTERVAL));

  this.svg = d3.select(id).append("svg")
        .attr("class", "PlinkoHistogram")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + this.margin.left + "," + this.margin.top + ")");
  var bins = this.histogramFunc(this.game.ballRegister);

  this.yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

  this.svg.selectAll("rect")
    .data(bins)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("transform", function(d) {
      return "translate(" + this.xScale(d.x0) + "," + this.yScale(d.length) + ")"; }.bind(this))
    .attr("width", function(d) { return this.xScale(d.x1 - d.x0) -1 ; }.bind(this))
    .attr("height", function(d) { return this.height - this.yScale(d.length); }.bind(this));

  this.svg.append("g")
    .attr('class', 'xaxis')
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(this.xScale));

  this.svg.append("g")
    .attr('class', 'yaxis')
    .call(d3.axisLeft(this.yScale));
}

PlinkoHistogram.prototype.update = function () {
  var bins = this.histogramFunc(this.game.ballRegister);

  this.yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

  var bars = this.svg.selectAll("rect.bar").data(bins);

  bars.attr("transform", function(d) {
      return "translate(" + this.xScale(d.x0) + "," + this.yScale(d.length) + ")"; }.bind(this))
    .attr("height", function(d) { return this.height - this.yScale(d.length); }.bind(this));

  bars.data(bins)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("transform", function(d) {
      return "translate(" + this.xScale(d.x0) + "," + this.yScale(d.length) + ")"; }.bind(this))
    .attr("width", function(d) { return this.xScale(d.x1, d.x0) -1 ; }.bind(this))
    .attr("height", function(d) { return this.height - this.yScale(d.length); }.bind(this));

  this.svg.select("g.yaxis")
    .call(d3.axisLeft(this.yScale));
}
