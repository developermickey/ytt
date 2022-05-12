
let _mediaRecorder,
		_record,
		_listeners = [];
let _audioChunks = [];

const recorderIsInitialized = () => {
	if(!_mediaRecorder)
		throw new Error(`Media recorder didn't initialized`);
};

const emitStatusChangeEvent = status => {
	for(const listener of _listeners)
		listener(status);
}

class AudioRecorder{
	
	get record(){
		return _record;
	}
	get status(){
		return _mediaRecorder ? _mediaRecorder.state : '';
	}
	
	constructor() {
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				_mediaRecorder = new MediaRecorder(stream);
				_mediaRecorder.addEventListener('dataavailable', event => {
					_audioChunks.push(event.data);
				});
				_mediaRecorder.addEventListener('stop', () => {
					_record = new Blob(_audioChunks,{ type: 'audio/mpeg' });
					_audioChunks = [];
					emitStatusChangeEvent(_mediaRecorder.state);
				});
			})
			.catch(console.error);
	}
	
	start(){
		recorderIsInitialized();
		_mediaRecorder.start();
		emitStatusChangeEvent(_mediaRecorder.state);
	}
	
	stop(){
		recorderIsInitialized();
		_mediaRecorder.stop();
	}
	
	onStatusChanged(cb){
		if(typeof cb !== 'function')
			throw new TypeError(`Listener have to be type of function, given type ${typeof cb}`)
		
		_listeners.push(cb);
	}
	
	
}

export default AudioRecorder;
