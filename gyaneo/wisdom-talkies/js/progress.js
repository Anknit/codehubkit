function progressChange(progressVal){
var progressBar = document.getElementById('progressBar');	
var progressArea = document.getElementById('progressArea');
progressArea.style.height = '3px';	
progressBar.style.width = progressVal+'%';
	if(progressVal == 100){
		setTimeout(function(){	progressArea.style.height = '0px';progressBar.style.width = '0%';},500);
	}
}