const maxStroke = 3;
var defaultStroke = maxStroke; //default stroke weight, keep small and relative to canvas size
var bgColor; //background color: white in bwMode, otherwise, variable
var lettersJSON; //imported from newsletters.json
var padding; //distance added between separate elements i.e. titles and body or edges and content
var hersheyTextHeight; //height of a line of text BEFORE scaling
var pageNavCount = 0; //tracks which page the user is on, where 0 is TOC
var newsletterCount = 0; //tracks which newsletter the user is viewing, where 0 is the most recent
var numPages; //number of pages, given by number of elements in TOC + a page for TOC.
var currentNewsletter, currentNewsletterArray; //array containing names of each element of TOC
var yShiftSum; //changes every time there is a vertical translation
var titleSize, bodyTextSize; //size of text, global variables as they are used in mousePressed()
var proportion = 0; //ratio of width to height. when 0, no imposed proportion; if -1, print-mode
var links = []; //stores each link created
var rightEdge; // used for determining line breaks

//booleans for tracking user choices/interactions
var bwMode = true; //initialized to black and white mode for ease of reading
var displayingMenu = true; //tracks whether or not user has hidden menu
var currentlyPressed = false; //tracks whether or not mouse is pressed

//different text colors on each page, where page 0 is TOC
//repeats if the number of pages is greater than the number of colors given
var textColors = ["lightSkyBlue", "lightGreen", "yellow"];

function preload() {
  lettersJSON = loadJSON('newsletters.json');
}

function setup() {
  switch(proportion){
    case 0:
      if(windowWidth > windowHeight){
        proportion = 1;
        setup();
      } else {
        createCanvas(windowWidth, windowHeight);
      }
      break;
    case -1:
      createCanvas(windowWidth, 11/8.5*windowWidth, SVG);
      break;
    case -2:
      createCanvas(windowWidth, windowWidth);
      break;
    case -3:
      createCanvas(windowWidth, windowWidth*16/9);
      break;
    default:
      createCanvas(windowWidth, 1/proportion*windowWidth);
      break;
  }

  //initializing variables related to newsletter JSON
  currentNewsletter = lettersJSON.newsletters[lettersJSON.newsletters.length-1-newsletterCount];
  currentNewsletterArray = Object.keys(currentNewsletter);
  if(proportion == -1){
    numPages = ceil(currentNewsletterArray.length / 8) * 8;
  } else {
    numPages = currentNewsletterArray.length;
  }

  noFill();
  noSmooth();
  strokeJoin(ROUND);

  //resetting tracking variables
  yShiftSum = 0;
  links = [];

  //use the width of an arbitrary character to approximate the text height
  hersheyTextHeight = P5.animatedHershey.estimateTextWidth("X"); 

  switch(proportion){
    case -1:
      defaultStroke = maxStroke/2;
      for(var rootPage=0; rootPage<numPages/4; rootPage++){
        if(rootPage%2 == 0){
          push();
          translate(width/2, height/2);
          displayPage(rootPage, width/2, height/2);
          translate(-width/2,0);
          displayPage(numPages-1-rootPage, width/2, height/2);
          rotate(PI);
          translate(-width/2, 0);
          displayPage(numPages/2 + rootPage, width/2, height/2);
          translate(-width/2, 0);
          displayPage(numPages/2 - 1 - rootPage, width/2, height/2);
          pop();
          save(currentNewsletter[currentNewsletterArray[0]] + "-zine-format-" + rootPage + "-front.svg");
        } else {
          push();
          translate(width/2, height/2);
          displayPage(numPages-1-rootPage, width/2, height/2);
          translate(-width/2,0);
          displayPage(rootPage, width/2, height/2);
          rotate(PI);
          translate(-width/2, 0);
          displayPage(numPages/2 - 1 - rootPage, width/2, height/2);
          translate(-width/2, 0);
          displayPage(numPages/2 + rootPage, width/2, height/2);
          save(currentNewsletter[currentNewsletterArray[0]] + "-zine-format-" + (rootPage-1) + "-back.svg");
          pop();
        }
      }
      break;
    case -2:
      for(var i=0; i<numPages; i++){
        displayPage(i, width, height);
        saveCanvas(currentNewsletter[currentNewsletterArray[0]] + "-page-" + i, 'jpg');
      }
      break;
    case -3:
      for(var i=0; i<numPages; i++){
        displayPage(i, width, height);
        saveCanvas(currentNewsletter[currentNewsletterArray[0]] + "-page-" + i, 'jpg');
      }
      break
    default:
      displayPage(pageNavCount, width, height);
      break;
  }
}

function displayPage(pageNavCount, w, h) {
  rightEdge = w;

  noStroke();
  if(!bwMode){
    bgColor = color('red');
    fill(bgColor);
    rect(0,0,w,h);
    noFill();
    stroke("white");
    var bodyStroke = textColors[pageNavCount%textColors.length];
  } else{
    bgColor = color('white');
    fill(bgColor);
    rect(0,0,w,h);
    noFill();
    stroke("black");
    var bodyStroke = "black";
  }

  //initializing design-related variables
  strokeWeight(defaultStroke);
  padding = w/30;
  if(w >= 1.5*h){
    titleSize = w/375;
    bodyTextSize = 0.5 * titleSize;
  } else {
    titleSize = w/300;
    bodyTextSize = 0.5 * titleSize;
  }
  var subtitleSize = 3/5 * titleSize;

  new Border(w-padding, h-padding, padding/2, padding/2);

  //only show navigation if page is not for export
  if(proportion > 0){
    //back arrow
    links.push(new link("<", "pageNavCount=(pageNavCount+numPages-1)%numPages", 3*padding - 0.5*animatedHershey.estimateTextWidth("<")*titleSize, 3*padding, titleSize));
    //forward arrow
    links.push(new link(">", "pageNavCount=(pageNavCount+1)%numPages", w-3*padding - 0.5*animatedHershey.estimateTextWidth("<")*titleSize, 3*padding, titleSize));  
  }
  
  yShiftSum = 3*padding;
  var title = "Dirty Money Alimony";
  hersheyText(title, titleSize, w/2, yShiftSum, "center");

  if(pageNavCount == 0){
    var subtitle = "A Comprehensive St. Louis Community Newsletter";
    hersheyText(subtitle, subtitleSize, w/2, yShiftSum, "center");
    yShiftSum+=padding;

    //change text color to body text color
    stroke(bodyStroke);

    hersheyText("Table of contents: ", bodyTextSize, 2*padding, yShiftSum);
    yShiftSum+=padding/2;

    if(proportion > 0){
      //displaying table of contents
      for(var i=1; i<numPages; i++){
        links.push(new link(i + ". " + currentNewsletterArray[i], "pageNavCount=".concat(i), 4*padding, yShiftSum, bodyTextSize));
      }
      //displaying menu
      if(w >= 1.5*h){
        displayMenu(w - animatedHershey.estimateTextWidth("resize for 9:16 image")*bodyTextSize - 2*padding, padding*6);
      } else {
        yShiftSum += padding;
        displayMenu(4*padding, yShiftSum);
      }
    } else {
      for(var i=1; i<numPages; i++){  
        if(!currentNewsletterArray[i]){
          hersheyText(i + ". blank", bodyTextSize, 4*padding, yShiftSum);
        } else {
          hersheyText(i + ". " + currentNewsletterArray[i], bodyTextSize, 4*padding, yShiftSum);
        }
        yShiftSum+=padding;
      }
    }

  } else {
    //change text color to body text color
    stroke(bodyStroke);

    if(proportion == -1){
      //displays page number
      hersheyText(currentNewsletter.date + " page " + pageNavCount, bodyTextSize, 2*padding, yShiftSum);
      yShiftSum+=padding;
    }

    //displays section title from JSON
    if(Object.entries(currentNewsletter)[pageNavCount]){
      hersheyText(Object.entries(currentNewsletter)[pageNavCount][0], bodyTextSize, 2*padding, yShiftSum);
      yShiftSum+=padding/2;

      //displays randomly ordered contents
      var pageContents = currentNewsletter[currentNewsletterArray[pageNavCount]].sort((a,b) => 0.5 - random());
      for(var i=0; i<pageContents.length; i++){
        var pageContentsEntries = Object.entries(pageContents[i]);
        hersheyText(pageContentsEntries[0][1] + ": " + pageContentsEntries[1][1], bodyTextSize, 4*padding, yShiftSum);
        for(var j=2; j<pageContentsEntries.length; j++){
          if(pageContentsEntries[j][0] == "img-src"){
            //loadImage(pageContentsEntries[j][1], img => {image(img, 5*padding, yShiftSum, w/4, img.h*(w/4)/img.w); yShiftSum+=img.h*(w/4)/img.w});
          } else {
            hersheyText(pageContentsEntries[j][1], bodyTextSize, 5*padding, yShiftSum);
          }
        }
      }
    }
  }
}

//text(), but for hershey fonts (hershey fonts used for printing process)
function hersheyText(msg, sc, x, y, alignment) {
  strokeWeight(defaultStroke/sc);

  var xLeft;
  var msgWords = msg.split(' ');
  var msgLines = [];
  var tempLine = "";

  if(!x){
    x = 0;
    y = 0;
  }

  if(!alignment){
    alignment = "left";
    xLeft = x;
  }

  switch(alignment){
    case "center":
      xLeft = x - 0.5 * animatedHershey.estimateTextWidth(msg) * sc;
      break;
    case "right":
      xLeft = x - animatedHershey.estimateTextWidth(msg) * sc;
      break;
  }

  for(var i=0; i<msgWords.length; i++){
    if(xLeft + 2*padding + animatedHershey.estimateTextWidth(tempLine + " " + msgWords[i])*sc <= rightEdge){
      tempLine += msgWords[i] + " ";
    } else {
      msgLines.push(tempLine);
      tempLine = msgWords[i] + " ";
    }
  }
  msgLines.push(tempLine);

  var tempYShift = 0;

  push();
  translate(x, y);
  scale(sc);

  for(var i=0; i<msgLines.length; i++){
    push();
    translate(0, tempYShift);
    P5.animatedHershey.putText(millis(), false, msgLines[i], {
      cmap: FONT_HERSHEY.PLAIN,
      align: alignment
    });
    pop();
    tempYShift += 2*hersheyTextHeight;
  }

  pop();

  strokeWeight(defaultStroke);
  yShiftSum += tempYShift*sc;
}

function displayMenu(x, y){
  yShiftSum = y;
  if(displayingMenu){
    links.push(new link("hide menu", "displayingMenu = false", x, yShiftSum, bodyTextSize));
    if(bwMode){
      links.push(new link("Color mode is: Off", "bwMode = false", x, yShiftSum, bodyTextSize));
    } else {
      links.push(new link("Color mode is: On", "bwMode = true", x, yShiftSum, bodyTextSize));
    }
    links.push(new link("Default size", "proportion = 0", x, yShiftSum, bodyTextSize));
    links.push(new link("Export " + numPages + " images for Instagram post", "proportion = -2", x, yShiftSum, bodyTextSize));
    links.push(new link("Export " + numPages + " images for Instagram story", "proportion = -3", x, yShiftSum, bodyTextSize));
    links.push(new link("Export for plotting zine", "proportion = -1", x, yShiftSum, bodyTextSize))
  } else {
    links.push(new link("+", "displayingMenu = true", x, yShiftSum, bodyTextSize));
  }
  yShiftSum = 0;
}

//link-related class and functions
class link {
  constructor(content, action, x, y, textSize){
    this.content = content;
    this.x1 = x;
    this.y1 = y - hersheyTextHeight*textSize/2;
    this.x2 = x + animatedHershey.estimateTextWidth(content)*textSize;
    this.y2 = this.y1 + hersheyTextHeight*textSize;
    this.action = Function(action);

    push();
    translate(x, y);
    hersheyText(this.content, textSize);
    pop();
  }
}

function mousePressed() {
  if(!currentlyPressed && bgColor){
    currentlyPressed = true;
    for(var i=0; i<links.length; i++){
      if(mouseX >= links[i].x1 && mouseX <= links[i].x2 && mouseY >= links[i].y1 && mouseY <= links[i].y2){
        links[i].action();
      }
    }
  }
}

function mouseReleased() {
  if(currentlyPressed){
    currentlyPressed = false;
    setup();
  }
}

function mouseMoved() {
  var overLink = false;
  for(var i=0; i<links.length; i++){
    if(mouseX >= links[i].x1 && mouseX <= links[i].x2 && mouseY >= links[i].y1 && mouseY <= links[i].y2){
      overLink = true;
    }
  }

  if(bgColor){
    if(overLink){
      cursor("alias");
    } else{
      cursor(ARROW);
    }
  }
}


/* global P5, FONT_HERSHEY */