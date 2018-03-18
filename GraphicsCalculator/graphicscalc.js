  var w;
        var h;
        var ve;
        var v;
        var u;
        var gw,gh;
        var numvertices;
        var c,ctx;
        var vr=[]; 
        var vtt=[];
        var rotating=false;
        var viewxrot=5*Math.PI/180.0;
        var t=0;
        function vertex2(x,y)
        {
            this.x=x;
            this.y=y;
        }
        
        function vertex3(x,y,z)
        {
             this.x=x;
             this.y=y;
             this.z=z;   
        }
            
        
        window.addEventListener('load', function()
        {                     
            init();
            setInterval(draw,15);
        });
        
        function init()
        {
            c=document.querySelector("canvas");
            ctx=c.getContext('2d');
            c.width=window.innerWidth;
            c.height=window.innerHeight;
            w=c.width;
            h=c.height;
            u=30;
            v=30;  
            gw=15;
            gh=15;
            numvertices=u*v;
            ve=new Array(numvertices);
            updateGraph();           
        }
        
    
            
        function drawEdge(p,p2)
        {
           ctx.moveTo(p.x,p.y);
           ctx.lineTo(p2.x,p2.y); 
        }
        
        function project(p,d)
        {
            var vp = new vertex2(0,0);
            
            vp.x = p.x / p.z;
            vp.y = -p.y / p.z;// flip because y going down is positive
        
            return vp;
        }
        
        function scale(p, w,h)
        {
           var vs = new vertex2(0,0);
           vs.x = (p.x*w/2.0)+w/2.0;
           vs.y = -(p.y*h/2.0)+h/2.0;
            return vs;
        }
        
        // rotate around y axis
        function rotateY(p, rad)
        {
            var nv = new vertex3(0,0,0);
            nv.x = p.x*Math.cos(rad)-p.z*Math.sin(rad);
            nv.y = p.y;
            nv.z = p.x*Math.sin(rad)+p.z*Math.cos(rad);
            return nv;
        }
        
        function rotateX(p,rad)
        {
           
             var nv=new vertex3(0,0,0);
             nv.x   = p.x;
             nv.y=p.y*Math.cos(rad)+p.z*Math.sin(rad);
             nv.z=-p.y*Math.sin(rad)+p.z*Math.cos(rad);
             return nv;
        }
        
        function rotateZ(p,rad)
        {
           var nv=new vertex3(0,0,0);
           nv.x= p.x*Math.cos(rad)+p.y*Math.sin(rad);
           nv.y=-p.x*Math.sin(rad)+p.y*Math.cos(rad);
           nv.z=p.z;
           return nv;
        }
        
        function translate(p,dx,dy,dz)
        {
           var nv =new vertex3(0,0,0);
           nv.x=p.x+dx;
            nv.y=p.y+dy;
            nv.z=p.z+dz;
            return nv;
        }
        
        // create a 3d function graph            
        function updateGraph()
        {
            var index=0;
            var fxy=document.getElementById("fxy").value;
            
            for(i=0;i<v;i++)
            {
                for(j=0;j<u;j++)
                {
                    var x=-gw/2.0+(i*gw)/u;
                    var y=-gh/2.0+(j*gh)/v;
                    var z=0;
                    var sx=fxy.replace("x",x);
                    var sy=sx.replace("y",y);
                    try
                    {
                        z=eval(sy);
                    }
                    catch(e)
                    {
                        x=0;
                        y=0; 
                    }
                    ve[index]=new vertex3(x,z,y);
                    index++; 
                } 
            }     
        }
        
        function rotateGraph()
        {
            if(!rotating)
                rotating=true;
            else
                rotating=false;
        }

        
        function adjustView()
        {
            for(i=0;i<numvertices;i++)
                ve[i]=rotateX(ve[i],viewxrot);
            
            viewxrot+=0.01;
            
        }
        
        function draw()
        {
            
            ctx.clearRect(0,0,c.width,c.height);
            ctx.strokeStyle='rgba(255,0,0,0.3)';
        
                
            if(rotating)
            {
                for(i=0;i<numvertices;i++)
                    vr[i]=rotateY(ve[i],t);
                for(i=0;i<numvertices;i++)
                    vtt[i]=translate(vr[i],0,0,-10);
                t+=0.05;
            }
            else
            {
                for(i=0;i<numvertices;i++)
                    vtt[i]=translate(ve[i],0,0,-10);             
            }         
            // project 3d vertices to screen
            var vp=[];
            for(i=0;i<numvertices;i++)
                vp[i]=project(vtt[i],1);
            
            // fit to screen
            var vs=[];
            for(i=0;i<numvertices;i++)
                vs[i]=scale(vp[i],c.width,c.height);
                
            drawGraph(vs);
        }
        
                
        function drawGraph(s)
        {
            // draw all function edges
            ctx.beginPath();
            
           var index1,index2,index3,index4;
            for(i=0;i<v;i++)
            {
               for(j=0;j<u-1;j++)
               {
                   index1=i+j*u;
                   index2=i+(j+1)*u;
                   index3=i*u+j;
                   index4=i*u+j+1;
                   drawEdge(s[index1],s[index2]);
                   drawEdge(s[index3],s[index4]);        
               } 
            }
                                   
           ctx.stroke();
        }