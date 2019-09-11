module.exports = {
    convertDate: (strDate) => {
        let months = 'Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember '.split(' ')
        let arrDate = strDate.split(' ')
        let DD = arrDate[0]
        let YYYY = arrDate[2]
        let MM;
        for (let i = 0; i < months.length; i++) {
            const month = months[i]
            if (arrDate[1] === month) {
                i++;
                if (i < 10) {
                    MM = '0' + i
                } else {
                    MM = '' + i
                }
            }
        }
        return YYYY+'-'+MM+'-'+DD
    }
}