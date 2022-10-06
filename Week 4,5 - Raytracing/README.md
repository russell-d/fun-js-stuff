I learned a lot about what was very mysterious to me before. Before, raytracing was just some fancy technology that required a very strong GPU to run on video games. I didn't really know what it was actually. I didn't know that it was how rays would bounce off things and just a bunch of lines being traced. I didn't even know it was used in movies D:

It was interesting to learn it in pieces from having a viewpoint, an object, a plane, and a light. This was super cool to piece together, since it made complete sense and was fun to follow along. Especially with the VR demonstration... very awesome. 


This programming assignment was pretty good in the beginning, but found out that my partner wasn't going to be working with me 😭. Not sure why, but she had let Austin know ahead of time that our code wouldn't be the same. So on my solo adventure, I had picked up from the spot I was at after office hours, which was generating the Ray for Pixel. This went well, but I hit an obstacle when making that square gradient, since I ended up with: 
![IMG_6151](https://user-images.githubusercontent.com/53790643/192434516-eaf7a74d-237e-4d1b-8498-e425e8e2cead.png)

After messing around with the `generateRayForPixel` function for a while, I realized it wasn't that, but the pixel width and eye distance was the problem. After fixing those two things, I ended up with a similar thing to the expected result. From here, it was pretty smooth sailing and I wasn't struggling much, just kinda fun stuff making these circles and things different colors. Logic was real simple here. 

Making the shadow wasn't a big problem, but I encountered a weird behavior with my plane since it wasn't really a big light, more like a spotlight.
![IMG_9961](https://user-images.githubusercontent.com/53790643/192434834-f1ff728e-13fe-4e47-b551-5a06402caf20.png)

At this point, this was good enough for me, so I just kept it. It looked cool anyways.. Adding the moving light was also very cool and was just a simple copy+paste. The shadow part looked pretty difficult, I tried messing around with it, but ultimately couldn't get something working.

I'm proud of where I got alone, but I wish I had my partner for the other half of the work since it would've been nice to discuss and talk about what needs to be done instead of just me asking myself these things. 

![image](https://user-images.githubusercontent.com/53790643/192435126-03876496-a29a-4f45-9c11-1b3c006bc6ce.png)
