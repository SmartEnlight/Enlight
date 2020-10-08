class RegExp {
	private firstLetter = /^[A-Za-z]{1}/;
	private email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
	private password = /^.*(?=^.{6,15}$)(?=.*\d)(?=.*[a-zA-Z]).*$/; //비밀번호는 영문과 숫자를 포함하여 6~15자리
	private username = /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,5}$/; //2~20자리
	public SignUp(email: string, password: string, username: string): boolean {
		if (this.email.test(email) && this.password.test(password) && this.username.test(username)) {
			return false;
		}
		return true;
	}
	public Email(email: string): boolean {
		return this.email.test(email) == true ? false : true;
	}
	public Pwd(password: string): boolean {
		return this.password.test(password) == true ? false : true;
	}
	public Username(username: string): boolean {
		return this.username.test(username) == true ? false : true;
	}
	public SignIn(email: string, password: string): boolean {
		if (this.email.test(email) && this.password.test(password)) {
			return false;
		} else {
			return true;
		}
	}
}

export default new RegExp();
