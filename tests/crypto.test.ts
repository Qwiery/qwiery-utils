import {describe, test, it, expect} from "vitest";
import {Crypto} from "../src/crypto";
import {exec} from "child_process";

function getSHA256(s) {
    return new Promise((resolve, reject) => {
        exec(`echo -n ${s}| shasum -a 256 | awk '{ print $1 }' `, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
            } else if (stderr) {
                console.log(stderr);
                reject(`stderr: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
}

describe("Crypto", function () {
    it("should work with SHA256", async function () {
        const s = "abcde";
        let enc = Crypto.SHA256.encrypt(s);
        // tried to fetch via CLI through the method above but for some reason doesnt work
        let shouldBe = "36bbe50ed96841d10443bcb670d6554f0a34b761be67ec9c4a8ad2c0c44ca42c";
        expect(enc).toEqual(shouldBe);
    });

    // it("should work with aes", function () {
    //     const s = Utils.randomId(120);
    //     let enc = Crypto.AES.encrypt(s);
    //     expect(Crypto.AES.decrypt(enc)).toEqual(s);
    // });

    it("should work with MD5", function () {
        // taken from the RDC https://www.rfc-editor.org/rfc/rfc1321
        const vectors = {
            "": "d41d8cd98f00b204e9800998ecf8427e",
            a: "0cc175b9c0f1b6a831c399e269772661",
            abc: "900150983cd24fb0d6963f7d28e17f72",
            "message digest": "f96b697d7cb7938d525a2f31aaf161d0",
            abcdefghijklmnopqrstuvwxyz: "c3fcd3d76192e4007dfb496cca67e13b",
            ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789: "d174ab98d277d9f5a5611c2c9f419d9f",
            "12345678901234567890123456789012345678901234567890123456789012345678901234567890": "57edf4a22be3c955ac49da2e2107b67a",
        };
        for (const k in vectors) {
            expect(Crypto.MD5.encrypt(k)).toEqual(vectors[k]);
        }
    });
});
