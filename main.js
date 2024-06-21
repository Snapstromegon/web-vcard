/**
 * @typedef {{name: Name, nickname: string, salutation?: string, org?: string, email: string, phone: string, website: string, address: string}} VCard
 * @typedef {{familyName: string, givenName: string, additionalNames?: string, honorPrefix?: string, honorPostfix?: string}} Name
 */

const form = document.getElementById("vcard-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  writeVcard({
    name: {
      familyName: formData.get("familyName"),
      givenName: formData.get("givenName"),
      additionalNames: formData.get("additionalNames"),
      honorPrefix: formData.get("honorPrefix"),
      honorPostfix: formData.get("honorPostfix"),
    },
    nickname: formData.get("nickname"),
    org: formData.get("org"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    address: formData.get("address"),
  });
});

/**
 * Transform a vcard to its string representation
 * @param {VCard} cardInfo
 * @returns {string}
 */
const vCardToString = (cardInfo) => {
  let result = [];
  result.push("BEGIN:VCARD");
  result.push("VERSION:4.0");
  result.push(
    `N:${[
      cardInfo.name.familyName,
      cardInfo.name.givenName,
      cardInfo.name.additionalNames,
      cardInfo.name.honorPrefix || "",
      cardInfo.name.honorPostfix || "",
    ].join(";")}`
  );
  result.push(`FN:${cardInfo.name.givenName} ${cardInfo.name.familyName}`);
  result.push(`NICKNAME:${cardInfo.nickname}`);
  result.push(`ORG:${cardInfo.org}`);
  result.push(`EMAIL:${cardInfo.email}`);
  result.push(`TEL:${cardInfo.phone}`);
  result.push(`URL:${cardInfo.website}`);
  result.push(`ADR:${cardInfo.address}`);
  result.push("END:VCARD");
  return result.join("\r\n");
};

const vCardToNFC = async (cardInfo) => {
  const writer = new NDEFReader();
  try {

    await writer.write({
      records: [
        {
          recordType: "mime",
          mediaType: "text/vcard",
          data: new TextEncoder().encode(vCardToString(cardInfo)),
        },
      ],
    });
    alert("VCard written to NFC");
  } catch (e) {
    alert("Error writing to NFC: " + e.message);
  }
}

const ta = document.querySelector("textarea");

/**
 * 
 * @param {VCard} cardInfo 
 */
const writeVcard = (cardInfo) => {
  ta.value = vCardToString(cardInfo);
  vCardToNFC(cardInfo);
};

const main = () => {
  if (!window.NDEFReader) {
    console.log("Web NFC is not supported.");
    document.body.classList.add("no-web-nfc");
    return;
  }
};

main();
