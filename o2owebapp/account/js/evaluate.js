axios.defaults.baseURL = API_HOST;
axios.defaults.headers.common['Authorization'] = window.localStorage.Auth;
axios.defaults.timeout = 10000;
axios.interceptors.response.use(function(response) {
	return response.data;
}, function(error) {
	var result = {error:true};
	if(error.code == 'ECONNABORTED'){
		result.msg = "请求超时";
	}else if(error.response.status == 400){
		result.msg = error.response.data;
	}else if(error.response.status == 401){
//		result.msg = "您没有权限访问";
		window.location.href = "../index/index.html";
	}else if(error.response.status == 500){
		result.msg = "服务器错误";
	}else{
		result.msg = "错误";
	}
	return result;
});
var pCourseId = Request("pCourseId");
var pTeacherId = Request("pTeacherId");
new Vue({
	el: '#app',
	data: function() {
		return {
			img_host:IMG_HOST,
			imgCourse:null,
			imgTeacher:null,
			photosCourse: [],
			photosTeacher: [],
			uploadUrl: API_HOST + '/BaseData/ForeUpload',
			headers: {
                'Authorization': window.localStorage.Auth
			},
			img_host: IMG_HOST,
			rateCourse:null,
			rateTeacher:null,
			rateCourseArray:['极差', '稍差', '一般', '很好', '非常好'],
			rateTeacherArray:['极差', '稍差', '一般', '很好', '非常好'],
			labelCourseOptions:[],
			labelTeacherOptions:[],
			checkboxCourseGroup: [],
			checkboxTeacherGroup: [],
			checkedTeacher:false,
			checkedCourse:false,
			textCourse:"",
			textTeacher:"",
			info:{
				course:{
					fightcourseclassaddressId:pCourseId,
					score:"",
					content:"",
					courseevaluates:"",
					coursephotos:"",
					checked:false,
					anonymous:""
				},
				teacher:{
					teacherId:pTeacherId,
					score:"",
					content:"",
					teacherevaluates:"",
					teacherphotos:"",
					checked:false,
					anonymous:""
				}
			}
		}
	},
	mounted(){
		//评价标签
		this.GetCourseEvaluationTag();
		this.GetTeacherEvaluationTag();
		
		this.GetFightCourseAddress();
		this.GetTeacher();
	},
	methods: {
		handlePhotosSuccess(res, file) {
			this.photosCourse.push({
				name: res[0],
				url: IMG_HOST + res[0]
			});
		},
		handleRemove(file, fileList) {
			for(var i in this.photosCourse) {
				if(this.photosCourse[i].name == file.name) {
					this.photosCourse.splice(i, 1);
					break;
				}
			}
		},
		handlePhotosSuccess2(res, file) {
			this.photosTeacher.push({
				name: res[0],
				url: IMG_HOST + res[0]
			});
		},
		handleRemove2(file, fileList) {
			for(var i in this.photosTeacher) {
				if(this.photosTeacher[i].name == file.name) {
					this.photosTeacher.splice(i, 1);
					break;
				}
			}
		},
		beforeAvatarUpload(file) {
			const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 < 5;
			if(!isImage) {
				this.$message.error('上传图片只能是 jpg/jpeg/png 格式!');
			}
			if(!isLt2M) {
				this.$message.error('上传图片大小不能超过 5MB!');
			}
			return isImage && isLt2M;
		},
		//课程评价标签
		GetCourseEvaluationTag(){
			axios.get('/BaseData/GetCourseEvaluationTag?pCourseId='+pCourseId)
	      	.then((response) => {
	      		if(response){
					this.labelCourseOptions = response;
	      		}
		   })
		},
		//老师评价标签
		GetTeacherEvaluationTag(){
			axios.get('/BaseData/GetTeacherEvaluationTag?pTeacherId='+pTeacherId)
	      	.then((response) => {
	      		if(response){
					this.labelTeacherOptions = response;
	      		}
		   })
		},
		//课程图片
		GetFightCourseAddress(){
			axios.get('/Evaluate/GetFightCourseAddress?pFightCourseAddressId='+pCourseId)
	      	.then((response) => {
	      		if(response){
	      			this.imgCourse = response;
	      		}
		    })
		},
		//老师图片
		GetTeacher(){
			axios.get('/Evaluate/GetTeacher?pTeacherId='+pTeacherId)
	      	.then((response) => {
	      		if(response.error){
	      			this.$message.error(response.msg);
	      			return;
	      		}
	      		this.imgTeacher = response;
		    })
		},
		//保存
		Save(){
			if(this.rateCourse == 0 || this.rateTeacher == 0){
				this.$message.error("请打星评价");
				return;
			}
			this.info.course.score = this.rateCourse;
			this.info.course.content = this.textCourse;
			this.info.course.courseevaluates = this.checkboxCourseGroup;
			this.info.course.coursephotos = this.photosCourse;
			this.info.course.checked = this.checkedCourse;
			if(this.checkedCourse){
				this.info.course.anonymous = "匿名";
			}else{
				this.info.course.anonymous = "";
			}
			
			this.info.teacher.score = this.rateTeacher;
			this.info.teacher.content = this.textTeacher;
			this.info.teacher.teacherevaluates = this.checkboxTeacherGroup;
			this.info.teacher.teacherphotos = this.photosTeacher;
			this.info.teacher.checked = this.checkedTeacher;
			if(this.checkedTeacher){
				this.info.teacher.anonymous = "匿名";
			}else{
				this.info.teacher.anonymous = "";
			}
			
			axios.post('/Evaluate/InsertEvaluate',this.info)
	      	.then((response) => {
	      		if(!response.success){
	      			this.$message.error(response.message);
	      			return;
	      		}
      			this.$message.success(response.message);
				window.history.go(-1);
		   })
		}
	}
});