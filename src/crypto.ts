import * as c from "jscrypto/es6";

class SHA256 {
	static encrypt(s) {
		return c.SHA256.hash(s).toString();
	}
}

class MD5 {
	static encrypt(s) {
		return c.MD5.hash(s).toString();
	}
}

class AES {
	static encrypt(s, key = "Quantum Topological Gravity") {
		return c.AES.encrypt(s, key).toString();
	}

	static decrypt(s, key = "Quantum Topological Gravity") {
		return c.AES.decrypt(s, key).toString(c.Utf8);
	}
}

/*
 * The classic cryptographic algorithms.
 * */
export class Crypto {
	static get SHA256() {
		return SHA256;
	}

	static get MD5() {
		return MD5;
	}

	static get AES() {
		return AES;
	}
}

