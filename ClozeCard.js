class ClozeCard {
  constructor (text, cloze){
    this.cloze = cloze;  
    this.partial = this.clozeCheck(text, cloze);
    this.fullText = text;  
  }

  clozeCheck(text, cloze){
    if (text.indexOf(cloze) !== -1) return text.replace(this.cloze, ' ... ')
    else {throw ('Error: cloze not found in text')}
  }

}

module.exports = ClozeCard;