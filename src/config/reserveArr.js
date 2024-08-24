export const reserveArr = (arr) => {
    let i;
    let arr1 = [];
    for(i=arr?.length-1;i>=0;i--) {
        arr1.push(arr[i]);
    }
    return arr1;
};

export const  formatTime = (date) => {
    var hour = new Date(date).getHours(); 
    var minutes = new Date(date).getMinutes(); 
    var seconds = new Date(date).getSeconds();
    var time = hour + "h " + minutes + "m " + seconds + "s ";
    var date1 = new Date(date).toDateString();
    var time2 = time + date1;
    return time2;
}