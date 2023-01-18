/* Modifications to ResultsHQ recording sheets High Jump page https://centreadmin.resultshq.com.au/centreadmin/RecordingFormsHighJump to allow filtering of age groups and PBs 
 * G.Low Jan 2023 v1
*/
(function () {
var PBMIN=0.00;
var PBMAX=2.55;
var AGEGROUPS = "11F 12M";

var a=document.createElement('input');
var min=document.createElement('input');
var max=document.createElement('input');

 function updateVars() {
  /* read input variables and filter table */
  a.value=AGEGROUPS=document.getElementById("ageGroups").value; 
  PBMIN=document.getElementById("pbmin").value; 
  PBMAX=document.getElementById("pbmax").value; 
  var tbodys = document.getElementsByTagName("tbody");
  filterTable(tbodys[tbodys.length-1]);	
 }

 function isMatchingRow(row) {
	let pbText = row.children[6].innerText; 
	pb = (pbText == "NA") ? 0 : Number(pbText); /*need to check for NA and map to 0*/
/*	let pb = Number(row.children[6].innerText); */
	return ((AGEGROUPS.includes(row.children[3].innerText + row.children[4].innerText)) && (PBMIN <= pb) && (pb <= PBMAX));
 }
 function filterTable(tbody) {
/*  let rows = tbody.getElementsByTagName('tr');*/
  let rows = tbody.getElementsByClassName('memberRow');
  for (row of rows) {
   row.style.display = isMatchingRow(row)? '' : 'none';
  }
 }
 function reformatPage() {
  /* remove line breaks between centre records to reduce header size */
  let t = document.getElementsByClassName('eventHeadingSide')[0];
  let b = t.getElementsByTagName('b')[0];
  let brs = b.getElementsByTagName('br');
  while (brs.length) {brs[0].parentNode.removeChild(brs[0]);}
  /* remove errant text at bottom of page */
  document.body.innerHTML = document.body.innerHTML.replace(/}/g, '');
  
  /* to reduce the top margin put the member sort on 1 line instead of 2 by removing labels, divs */
  let d10 = document.getElementsByClassName('span10')[0];
  d10.innerHTML = d10.innerHTML.replace(/<div class="span.".*>/g, '').replace(/<.div>/g, '').replace(/<\/?label>/g, '');

  /* remove last page break */
  let h2 = document.getElementsByTagName('h2')[0];
  h2.style.removeProperty("page-break-after");
 }
 
 function setAgeGrouping() {
  /* Set default age grouping based on first row */
  let row = document.getElementsByClassName('memberRow')[0];
  switch (row.children[3].innerText + row.children[4].innerText) {
  case "11F": case "12M": AGEGROUPS = "11F 12M"; break;
  case "11M": case "12F": AGEGROUPS = "11M 12F"; break;
  case "13F": case "13M": AGEGROUPS = "13M 13F"; break;
  case "14M": case "14F": case "14F": AGEGROUPS = "14M 14F 15F"; break;
  default:AGEGROUPS = "15M 17F 17M";
  }
 }
 
 function createFilter() {
  /*Add age groups, PB range filter */
  let r = document.getElementsByClassName('borderedRow')[0];
  r.cells[1].colSpan="6"; /*was 7*/
  r.deleteCell(2); /*was 4*/

  /* override print style to show input box contents - only works on first page? */
  Array.prototype.forEach.call(document.getElementsByTagName('style'), function(style) {
    style.innerText = style.innerText.replace(/visibility: hidden/gi, 'visibility: true');
	});
 
  setAgeGrouping();
  let c2=r.insertCell(-1);
  c2.colSpan="2";
  c2.innerHTML= "Age Groups";
  a.type="text";
  a.value=a.placeholder=AGEGROUPS;
  a.id="ageGroups";
  c2.appendChild(a);	

  let c3=r.insertCell(-1);
  c3.colSpan="1";
  c3.innerHTML= "PB min";
  min.type="number";
  min.step="0.01";
  min.value=min.placeholder=PBMIN;
  min.id="pbmin";
  c3.appendChild(min);	

  let c4=r.insertCell(-1);
  c4.colSpan="1";
  c4.innerHTML= "PB max";
  max.type="number";
  max.step="0.01";
  max.value=max.placeholder=PBMAX;
  max.id="pbmax";
  c4.appendChild(max);	

  let c5=r.insertCell(-1);
  c5.colSpan="1";
  var b = document.createElement("button");
  b.innerText="Filter";
  b.addEventListener('click', event => {updateVars()});
  c5.appendChild(b);

 }
 /*main*/
 reformatPage();
 createFilter();
 
})();
