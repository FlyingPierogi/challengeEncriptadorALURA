/*limpia el label de introducir texto cuando se clikea el area text*/
function clearlabel(){
    document.getElementById('hlbtexto').hidden = "1";
}

function clearimage(){
    document.getElementById('tafinish').style.background= "none";
    document.getElementById('lbnotextox').hidden = "1";
}

/*implementacion del copiar*/
function copiartexto(){
      // Get the text field
  var copyText = document.getElementById("tafinish");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  ////alert("Copied the text: " + copyText.value);
}

/*
*Message from id =textform
*Message to id= tatextofinal
*Button encrypt id = encriptar
*Button decrypt id = desencriptar
*/

  /*
  Store the calculated ciphertext here, so we can decrypt the message later.
  */
  let ciphertext;

  /*
  Fetch the contents of the "message" textbox, and encode it
  in a form we can use for the encrypt operation.
  */
  function getMessageEncoding() {
    const messageBox = document.querySelector("#tastart");
    let message = messageBox.value;
    let enc = new TextEncoder();
    return enc.encode(message);
  }

  /*
  Get the encoded message, encrypt it and display a representation
  of the ciphertext in the "Ciphertext" element.
  */
  async function encryptMessage(key) {
    let encoded = getMessageEncoding();
    ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encoded
    );

    let buffer = new Uint8Array(ciphertext, 0, 5);
    const ciphertextValue = document.querySelector("#tafinish");
    ciphertextValue.classList.add('fade-in');
    ciphertextValue.addEventListener('animationend', () => {
      ciphertextValue.classList.remove('fade-in');
    });
    ciphertextValue.textContent = `${buffer}`;
  }

  /*
  Fetch the ciphertext and decrypt it.
  Write the decrypted message into the "Decrypted" box.
  */
  async function decryptMessage(key) {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      ciphertext
    );

    let dec = new TextDecoder();
    const decryptedValue = document.querySelector("#tafinish");
    decryptedValue.classList.add('fade-in');
    decryptedValue.addEventListener('animationend', () => {
      decryptedValue.classList.remove('fade-in');
    });
    decryptedValue.textContent = dec.decode(decrypted);
  }

  /*
  Generate an encryption key pair, then set up event listeners
  on the "Encrypt" and "Decrypt" buttons.
  */
  window.crypto.subtle.generateKey(
    {
    name: "RSA-OAEP",
    // Consider using a 4096-bit key for systems that require long-term security
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  ).then((keyPair) => {
    const encryptButton = document.querySelector(".botonencriptar");
    encryptButton.addEventListener("click", () => {
      encryptMessage(keyPair.publicKey);
    });

    const decryptButton = document.querySelector(".botondesencriptar");
    decryptButton.addEventListener("click", () => {
      decryptMessage(keyPair.privateKey);
    });
  });