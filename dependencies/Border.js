class Border {
    constructor(inputW, inputH, x, y) {
      if (!inputW) {
        this.w = width;
        this.h = height;
      } else {
        this.w = inputW;
        this.h = inputH;
      }

      push();
      translate(x, y);
      this.drawBorder();
      pop();
    }
  
    drawBorder() {
      noFill();
  
      var pad = max(this.w/90, this.h/90);
  
      var horizLoops = (sqrt(25 * this.w + 76)) / 12;
      var vertLoops = (sqrt(25 * this.h + 76)) / 12;
  
      var mx = 1.5;
      var my = 0.25;
  
      var pointDist = horizLoops * PI / 8;
      var noiseVal = min(this.w/1000, this.h/1000);

      var x = 0;
      var y = 0;

      beginShape();
      var drift = 0;
      var xShift = randomGaussian((this.w - 75) / (2*horizLoops), noiseVal*20);
      var beginX = xShift;
      for (var i = 0; x < this.w - 2*pad; i += pointDist) {
        var t = i / this.w * TWO_PI * horizLoops;
        drift = randomGaussian(drift, noiseVal);
        if(drift < pad / 6){
          drift += randomGaussian(1, 0.25);
        } else if (drift > 2*pad){
          drift -= randomGaussian(1, 0.25);
        }
        y = pad + pad * sin(t) + drift;
        x = xShift + randomGaussian((horizLoops * (1.0 * t + my * sin(3 * t) + mx * sin(2 * t))), noiseVal);
        vertex(x, y);
      }
      drift = 0;
      var yShift = y;
      for (var i = 0; y < this.h - 2*pad; i+=pointDist) {
        var t = i / this.h * TWO_PI * vertLoops;
        drift = randomGaussian(drift, noiseVal);
        if(drift < pad / 6){
          drift += randomGaussian(1, 0.25);
        } else if (drift > 2*pad){
          drift -= randomGaussian(1, 0.25);
        }
        x = this.w - pad + pad * sin(t) - drift;
        y = yShift + randomGaussian((vertLoops * (1.0 * t + my * sin(3 * t) + mx * sin(2 * t))), noiseVal);
        vertex(x, y);
      }
      endShape();

      xShift=this.w-x-2*pad+((this.w - 75) / (2*horizLoops));
      yShift=this.h-y-pad;
      push();
      translate(this.w, this.h);
      rotate(PI);
      beginShape();
      vertex(this.w-x, this.h-y);
      x=0;
      y=0;
      var drift = 0;
      for (var i = 0; x < this.w - 2*pad; i += pointDist) {
        var t = i / this.w * TWO_PI * horizLoops;
        drift = randomGaussian(drift, noiseVal);
        if(drift < pad / 6){
          drift += randomGaussian(1, 0.25);
        } else if (drift > 2 * pad){
          drift -= randomGaussian(1, 0.25);
        }
        y = yShift + pad + pad * sin(t) + drift;
        x = xShift + randomGaussian((horizLoops * (1.0 * t + my * sin(3 * t) + mx * sin(2 * t))), noiseVal);
        vertex(x, y);
      }
      drift = 0;
      var yShift = y;
      for (var i = 0; y < this.h - 2*pad; i+=pointDist) {
        var t = i / this.h * TWO_PI * vertLoops;
        drift = randomGaussian(drift, noiseVal);
        if(drift < pad / 6){
          drift += randomGaussian(1, 0.25);
        } else if (drift > 2 * pad){
          drift -= randomGaussian(1, 0.25);
        }
        x = this.w - pad + pad * sin(t) - drift;
        y = yShift + randomGaussian((vertLoops * (1.0 * t + my * sin(3 * t) + mx * sin(2 * t))), noiseVal);
        vertex(x, y);
      }
      vertex(this.w - beginX, this.h - pad);
      endShape();
      pop();
    }
  }
  
  /* global alpha, blue, brightness, CENTER, color, green, hue, lerpColor, lightness, red, saturation, p5.Color, Setting, background, clear, colorMode, fill, noFill, noStroke, stroke, erase, noErase, arc, ellipse, circle, line, point, quad, rect, square, triangle, ellipseMode, noSmooth, rectMode, smooth, strokeCap, strokeJoin, strokeWeight, bezier, bezierDetail, bezierPoint, bezierTangent, curve, curveDetail, curveTightness, curvePoint, curveTangent, beginContour, beginShape, bezierVertex, curveVertex, endContour, endShape, quadraticVertex, vertex, plane, box, sphere, cylinder, cone, ellipsoid, torus, loadModel, model, HALF_PI, PI, QUARTER_PI, TAU, TWO_PI, DEGREES, RADIANS, print, frameCount, deltaTime, focused, cursor, frameRate, noCursor, displayWidth, displayHeight, windowWidth, windowHeight, windowResized, width, height, fullscreen, pixelDensity, displayDensity, getURL, getURLPath, getURLParams, preload, setup, draw, remove, disableFriendlyErrors, noLoop, loop, isLooping, push, pop, redraw, p5, DOM, p5.Element, select, selectAll, removeElements, changed, input, createDiv, createP, createSpan, createImg, createA, createSlider, createButton, createCheckbox, createSelect, createRadio, createColorPicker, createInput, createFileInput, createVideo, createAudio, createCapture, createElement, p5.MediaElement, p5.File, p5.Graphics, createCanvas, resizeCanvas, noCanvas, createGraphics, blendMode, drawingContext, setAttributes, console, applyMatrix, resetMatrix, rotate, rotateX, rotateY, rotateZ, scale, shearX, shearY, translate, LocalStorage, storeItem, getItem, clearStorage, removeItem, createStringDict, createNumberDict, p5.TypedDict, p5.NumberDict, append, arrayCopy, concat, reverse, shorten, shuffle, sort, splice, subset, float, int, str, boolean, byte, char, unchar, hex, unhex, join, match, matchAll, nf, nfc, nfp, nfs, split, splitTokens, trim, deviceOrientation, accelerationX, accelerationY, accelerationZ, pAccelerationX, pAccelerationY, pAccelerationZ, rotationX, rotationY, rotationZ, pRotationX, pRotationY, pRotationZ, turnAxis, setMoveThreshold, setShakeThreshold, deviceMoved, deviceTurned, deviceShaken, Keyboard, keyIsPressed, key, keyCode, keyPressed, keyReleased, keyTyped, keyIsDown, Mouse, movedX, movedY, mouseX, mouseY, pmouseX, pmouseY, winMouseX, winMouseY, pwinMouseX, pwinMouseY, mouseButton, mouseIsPressed, mouseMoved, mouseDragged, mousePressed, mouseReleased, mouseClicked, doubleClicked, mouseWheel, requestPointerLock, exitPointerLock, touches, touchStarted, touchMoved, touchEnded, createImage, saveCanvas, saveFrames, p5.Image, loadImage, image, tint, noTint, imageMode, Pixels, pixels, blend, copy, filter, get, loadPixels, set, updatePixels, IO, loadJSON, loadStrings, loadTable, loadXML, loadBytes, httpGet, httpPost, httpDo, p5.XML, createWriter, p5.PrintWriter, save, saveJSON, saveStrings, saveTable, Table, p5.Table, p5.TableRow, day, hour, minute, millis, month, second, year, Math, abs, ceil, constrain, dist, exp, floor, lerp, log, mag, map, max, min, norm, pow, round, sq, sqrt, fract, Vector, createVector, p5.Vector, noise, noiseDetail, noiseSeed, randomSeed, random, randomGaussian, Trigonometry, acos, asin, atan, atan2, cos, sin, tan, degrees, radians, angleMode, textAlign, textLeading, textSize, textStyle, textWidth, textAscent, textDescent, loadFont, text, textFont, p5.Font, orbitControl, debugMode, noDebugMode, ambientLight, specularColor, directionalLight, pointLight, lights, lightFalloff, spotLight, noLights, Material, loadShader, createShader, shader, resetShader, normalMaterial, texture, textureMode, textureWrap, ambientMaterial, emissiveMaterial, specularMaterial, shininess, p5.Geometry, p5.Shader, camera, perspective, ortho, frustum, createCamera, p5.Camera, setCamera*/
  