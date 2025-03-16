/**
 * Bar chart class
 */
export default class BarChart{ 

    // Attributes
    width; height; margin; // size 
    svg; chart; bars; axisX; axisY; labelX; labelY; title; // selections 
    scaleX; scaleY; // scales
    data; // internal data 

    // PART 2 - Add callbacks attributes
    barClick = ()=>{}; 
    barHover = ()=>{}; 
    barOut = ()=>{}; 
    // Constructor
    // margin -> [top, bottom, left, right]
    constructor(container, width, height, margin){ 

        this.width = width; 
        this.height = height;
        this.margin = margin;
 
        this.svg = d3.select(container).append('svg')
            .classed('viz barchart', true) 
            .attr('width', this.width).attr('height', this.height); 
        
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`);
               
        this.bars = this.chart.selectAll('rect.bar'); 

        this.axisX = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.height-this.margin[1]})`);
        this.axisY = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);
        
        this.labelX = this.svg.append('text')
            .attr('transform', `translate(${this.width/2},${this.height})`)
            .style('text-anchor', 'middle').attr('dy',-5);
        this.labelY = this.svg.append('text')
            .attr('transform', `translate(0,${this.margin[0]})rotate(-90)`)
            .style('text-anchor', 'end')
            .attr('dy', 15);

        this.title = this.svg.append('text')
            .classed('title', true)
            .attr('transform', `translate(${this.width/2},${this.margin[0]})`)
            .style('text-anchor', 'middle');
    } 

 

    // Private methods 

    // data is in the format [[key,value],...] 
    #updateBars(){ 
        // PART 3 - Modify the update chain to add transitions

        this.bars = this.bars 
            .data(this.data, d=>d[0]) 
            .join('rect') 
            .classed('bar', true) 
            .attr('x', d=>this.scaleX(d[0])) 
            .attr('y', d=>this.scaleY(d[1])) 
            .attr('width', this.scaleX.bandwidth()) 
            .attr('height', d=>this.scaleY(0)-this.scaleY(d[1]))
            // PART 1 - Add event listeners to highlight bars on mouse-over
            // .on('mouseover', (event,datum)=>{
            //     // console.log(datum);
            //     d3.select(event.target)
            //         .classed('highlighted',true)
            //     })
            // .on('mouseout', (event,datum)=>{
            //     // console.log(datum);
            //     d3.select(event.target)
            //         .classed('highlighted',false)
            //     });
            // PART 1 - Add title selections to make tooltips
        this.bars.selectAll('title')
                .data(d=>[d])
                .join('title')
                .text(d=>`${d[0]}: ${d[1]}`);
            // PART 2 - Change event listener setup to call #updateEvents instead
                this.#updateEvents
        } 

    // PART 2 - Add private #updateEvents method
    #updateEvents(){
        this.bars
            .on('mouseover', this.barHover)
            .on('mouseout', this.barOut)
            .on('click', (e,d)=>{
                console.log('bar clicked: ',d);
                this.barClick(e,d);
            });
    }


    #updateScales(){
        let chartWidth = this.width-this.margin[2]-this.margin[3], 
            chartHeight = this.height-this.margin[0]-this.margin[1]; 
        let rangeX = [0, chartWidth], 
            rangeY = [chartHeight, 0]; 
        let domainX = this.data.map(d=>d[0]), 
            domainY = [0, d3.max(this.data, d=>d[1])]; 
        this.scaleX = d3.scaleBand(domainX, rangeX).padding(0.2); 
        this.scaleY = d3.scaleLinear(domainY, rangeY).nice(); 
    }

    #updateAxes(){
        let axisGenX = d3.axisBottom(this.scaleX),
            axisGenY = d3.axisLeft(this.scaleY);
        this.axisX.call(axisGenX);
        this.axisY.call(axisGenY);
    }
    

    // Public API 

    // The dataset parameter needs to be in a generic format, 
    // so that it works for all future data 
    // here we assume a [[k,v], ...] format for efficiency 
    render(dataset){ 
        this.data = dataset;
        this.#updateScales();
        this.#updateBars(); 
        this.#updateAxes();
        return this; // to allow chaining 
    } 

    setLabels(labelX='', labelY=''){
        this.labelX.text(labelX);
        this.labelY.text(labelY);
        return this;
    }

    setTitle(title=''){
        this.title.text(title);
        return this;
    }

    // PART 2 - Add public methods to change the callback attributes (barClick, barHover, barOut)
    setBarClick(f = ()=>{}){ 
        // register new callback 
        this.barClick = f; 
        // rebind callback to event 
        this.#updateEvents(); 
        // return this for chaining 
        return this; 
        }
    setBarHover(f = ()=>{}){
        // register new callback 
        this.barHover = f; 
        // rebind callback to event 
        this.#updateEvents(); 
        // return this for chaining 
        return this; 
    }    
    setBarOut(f = ()=>{}){
        // register new callback 
        this.barOut = f; 
        // rebind callback to event 
        this.#updateEvents(); 
        // return this for chaining 
        return this; 
    }    
    // PART 2 - Add public method for setting the 'highlighted' class of barcharts
    highlightBars(keys = []){ 
        // reset highlight for all bars 
        this.bars.classed('highlighted', false); 
        // filter bars and set new highlights 
        this.bars.filter(d=>keys.includes(d[0])) 
        .classed('highlighted', true); 
        // return this for chaining 
        return this; 
        } 
// PART 1 - Add event listeners to highlight bars on mouse-over

} 

