import { interpolateInferno, interpolateRainbow } from "d3-scale-chromatic"
import { RawListItem, SpanListItem } from "../property.model";

const colorScale = interpolateRainbow;
const colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
}

const calculatePoint = function (i, intervalSize, colorRangeInfo) {
    var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return (useEndAsStart
        ? (colorEnd - (i * intervalSize))
        : (colorStart + (i * intervalSize)));
}

export const generateNextColor = function (index) {
    var { colorStart, colorEnd } = colorRangeInfo;
    var colorRange = colorEnd - colorStart;
    // accomadate 20 colors
    //var intervalSize = colorRange / dataLength;
    var intervalSize = colorRange / 10;
    //console.log("Color", index)
    let colorPoint = calculatePoint(index, intervalSize, colorRangeInfo);
    return colorScale(colorPoint);
}


export const unitList: RawListItem[] = [
//  { id: 0, unit: "second", text: "measurements", format: "h:mm:ss.SSS a" },
  { id: 1, unit: "second", text: "second", format: "h:mm:ss a" },
  { id: 60, unit: "second", text: "minute", format: "h:mm a" },
  { id: 3600, unit: "minute", text: "hour", format: "hA" },
  { id: 86400, unit: "day", text: "day", format: "MMM D" },
  { id: 604800, unit: "week", text: "week",format: "week ll" },
  { id: 2592000, unit: "month", text: "month", format: "MMM YYYY" },
  { id: 7776000, unit: "quarter", text: "quarter",format: "[Q]Q - YYYY" },
  { id: 31536000, unit: "year", text: "year", format: "YYYY" },
];


export const spanList: SpanListItem[] = [
  { text: "Realtime", spanInSeconds: 0},
  { text: "Last minute", spanInSeconds: 60, displayUnit: "second"},
  { text: "Last 5 minutes", spanInSeconds: 300, displayUnit: "minute"},
  { text: "Last 30 minutes", spanInSeconds: 1800, displayUnit: "hour"},
  { text: "Custom", spanInSeconds: -1, displayUnit: "hour"},
];

export const flatten = function(data) {
    var result = {};
    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++)
          recurse(cur[i], prop ? prop + "." + i : "" + i);
        if (l == 0)
          result[prop] = [];
      } else {
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty)
          result[prop] = {};
      }
    }
    recurse(data, '');
    return result;
  }