var phoneNumReg = new RegExp(/^1[34578]\d{9}$/);

new Vue({
	el: '#app',
	data:{
		imageUrl: '',
        uploadUrl: API_HOST + '/User/UploadHeader',
		headers: {
			'Authorization':  window.localStorage.Auth
		},
		img_host: IMG_HOST,
		info:{
			f_sex:false,
			f_birthday:null
		}
	},
	mounted(){
		this.GetUserEntity();
	},
	methods: {
		handleAvatarSuccess(res, file) {
			this.imageUrl = res[0];
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
		GetUserEntity(){
			var data = getAPI("/User/GetUserEntity",null,"get");
			if(data){
				this.info  = data;
				if(data.f_head_portrait){
					this.imageUrl = data.f_head_portrait;
				}
			}
		},
		GetDate(){
			var dtpicker = new mui.DtPicker({
			    "type": "date",
			    beginDate: new Date(1950, 01, 01),//设置开始日期
			    endDate:new Date()
			})
			dtpicker.show((e) =>  {
				this.info.f_birthday = e.text;
			});
		},
		Save(){
			if(this.info.f_phone && !(phoneNumReg.test(this.info.f_phone))){
				mui.alert("手机号码格式不正确！");
				return;
			}
			getAPIasync("/User/ModifyUserPhone",this.info,"post",function(e){
				if(e){
					mui.alert("保存成功",function(){
						window.history.go(-1);
					});
				}
			});
		}
	}
});