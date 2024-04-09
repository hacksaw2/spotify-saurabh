console.log("Lets write javascript")
let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
 if (isNaN(seconds) || seconds < 0){
    return "00:00";
 }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){


currFolder = folder;
let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
let response = await a.text();
let div = document.createElement("div")
div.innerHTML = response;
let as = div.getElementsByTagName("a")
songs = []

for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
    
}
 // Show all the song in the playlist

 let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
 songUL.innerHTML = ""
 for (const song of songs) {
 
     songUL.innerHTML = songUL.innerHTML + `<li><img  src="music.svg" alt="">
         <div class="info">
             <div>${song.replaceAll("%20"," ")}</div>
             <div>-Saurabh </div>
         </div>
         <div class="playnow">
             <span>Play Now</span>
         <img src="play.svg" alt="">
         </div> </li>` ;
     
 }
 
 // Attach an event listener ton each song
 
 Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
 
 
 
     e.addEventListener("click", element=>{
 
     
     console.log(e.querySelector(".info").firstElementChild.innerHTML)
     playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
 
     })
    })


}

const playMusic = (track, pause=false)=>{

    currentSong.src = `/${currFolder}/` + track
    if(!pause){

        currentSong.play()
        play.src = "pause.svg"
    
    }
    

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML ="00:00/00:00"


}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
   let response = await a.text();
   let div = document.createElement("div")
   div.innerHTML = response;
   let anchors = div.getElementsByTagName("a")
   let cardContainer = document.querySelector(".cardContainer")

        
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
    
    if(e.href.includes("/songs")){

        let folder = e.href.split("/").slice(-1)[0]
        
        // Get the metadata of the  folder
        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
   let response = await a.json();
   
   cardContainer.innerHTML = cardContainer.innerHTML + `
   <div data-folder="${folder}" class="card">
       <div class="play">
       <div>
           <img src="https://cdn.hugeicons.com/icons/play-stroke-rounded.svg" alt="play" width="24"
               height="24" style="filter: invert(100%);" />
       </div>
   </div>

   <img src="/songs/${folder}/cover.jpg" alt="">
   <h2>${response.title}</h2>
   <p>${response.description}</p>
</div>`
    }
}

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    
        })
        })
       
    


    }



async function main(){

    

    // Get the list of all the songs
  await  getSongs("songs/ncs")
playMusic(songs[0],true)

// Display all the albums on the page
   displayAlbums()




// Attach an event listener to play,next and previous
document.getElementById('play').addEventListener("click",()=>{
    
    if(currentSong.paused){
        currentSong.play();
        play.src = "pause.svg";
    }
    else{
        currentSong.pause();
        play.src = "play.svg";
    }
})


// listen for timeupdate event 

currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)* 100 + "%"
})

// add an event listener to seek bar
document.querySelector(".seekbar").addEventListener("click", e=>{
   let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100;

    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime =((currentSong.duration)* percent)/100

})

// add an event listener  for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0"
})

// add an event listener  for hamburger
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%"
})


// add an event listener yo previous 

previous.addEventListener("click",()=>{
    console.log("Previous clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
    playMusic(songs[index-1])
    }
})

// add an event listener to  next
next.addEventListener("click",()=>{
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1)< songs.length){
    playMusic(songs[index+1])
    }

})

// add an event to  volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    
    currentSong.volume = parseInt(e.target.value)/100
})





}
main()



