//without worker the javascript interval does not work when tab is inactive
function elementaryPOSRepeatMessage() {
  postMessage('tick');
  setTimeout("elementaryPOSRepeatMessage()",30000);
}
elementaryPOSRepeatMessage();
