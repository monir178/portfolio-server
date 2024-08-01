const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//Must remove "/" from your production URL
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://site-monir.vercel.app",
            "https://portfolio-dashboard-client.vercel.app"
        ],
        credentials: true,
    })
);

//middleware
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ulnoerh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client = null;
try {
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },

    });
} catch (error) {
    console.error(error);
}

async function run() {
    try {
        const projectsCollection = client.db('monirPortfolio').collection('projects');
        const blogsCollection = client.db('monirPortfolio').collection('blogs');
        const skillsCollection = client.db('monirPortfolio').collection('skills');




        // ! Project Section
        //get all projects
        app.get('/all-projects', async (req, res) => {
            try {
                const query = {};
                const projects = await projectsCollection.find(query).sort({ createdAt: -1 }).toArray();
                res.send({
                    success: true,
                    data: projects,
                    message: 'All Projects retrieved successfully'
                });
            } catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        });


        //for adding a Project
        app.post('/create-project', async (req, res) => {
            try {
                const project = { ...req.body, createdAt: new Date() };
                const result = await projectsCollection.insertOne(project);

                if (result.insertedId) {
                    res.send({
                        success: true,
                        message: "Successfully added your Project",
                    });
                } else {
                    res.send({
                        success: false,
                        error: "Couldn't add the Project"
                    });
                }
            } catch (error) {
                console.log(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        });


        //delete a Project
        app.delete('/projects/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const result = await projectsCollection.deleteOne({
                    _id: new ObjectId(id)
                });
                if (result.deletedCount) {
                    res.send({
                        success: true,
                        message: 'Project deleted successfully.'
                    });
                }
                else {
                    res.send({
                        success: false,
                        error: "Couldn't delete the Project",
                    });
                }
            }
            catch (error) {
                console.error(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })

        // update a project
        app.patch('/projects/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const { _id, ...updatedFields } = req.body;
                const result = await projectsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedFields }
                );
                if (result.matchedCount) {
                    res.status(200).json({
                        success: true,
                        message: "Project updated successfully",
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        error: "Project not found or couldn't be updated",
                    });
                }
            } catch (error) {
                console.error("Error updating service:", error);
                res.status(500).json({
                    success: false,
                    error: "Internal server error",
                });
            }
        });

        // ! Blogs Section
        //get all blogs
        app.get('/all-blogs', async (req, res) => {
            const query = {};
            const blogs = await blogsCollection.find(query).toArray();
            res.send({
                success: true,
                data: blogs,
                message: 'All Blogs retrieved successfully'
            });
        });

        //for adding a Blog
        app.post('/create-blog', async (req, res) => {
            try {
                const result = await blogsCollection.insertOne(req.body);

                if (result.insertedId) {
                    res.send({
                        success: true,
                        message: "Successfully added your Blog",

                    });
                } else {
                    res.send({
                        success: false,
                        error: "Couldn't add the Blog"
                    });
                };
            }
            catch (error) {
                console.log(error.name, error.message)
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        });
        // update a blog
        app.patch('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const { _id, ...updatedFields } = req.body;
                const result = await blogsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedFields }
                );
                if (result.matchedCount) {
                    res.status(200).json({
                        success: true,
                        message: "Blog updated successfully",
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        error: "Blog not found or couldn't be updated",
                    });
                }
            } catch (error) {
                console.error("Error updating service:", error);
                res.status(500).json({
                    success: false,
                    error: "Internal server error",
                });
            }
        });

        //delete a Blog
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const result = await blogsCollection.deleteOne({
                    _id: new ObjectId(id)
                });
                if (result.deletedCount) {
                    res.send({
                        success: true,
                        message: 'Blog deleted successfully.'
                    });
                }
                else {
                    res.send({
                        success: false,
                        error: "Couldn't delete the Blog",
                    });
                }
            }
            catch (error) {
                console.error(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })

        // ! Skills Section
        //get all blogs
        app.get('/skills', async (req, res) => {
            const query = {};
            const skills = await skillsCollection.find(query).toArray();
            res.send({
                success: true,
                data: skills,
                message: 'All skills retrieved successfully'
            });
        });

        //for adding a Skill
        app.post('/create-skill', async (req, res) => {
            try {
                const result = await skillsCollection.insertOne(req.body);

                if (result.insertedId) {
                    res.send({
                        success: true,
                        message: "Successfully added your skill",

                    });
                } else {
                    res.send({
                        success: false,
                        error: "Couldn't add the skill"
                    });
                };
            }
            catch (error) {
                console.log(error.name, error.message)
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        });
        // update a Skill
        app.patch('/skills/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const { _id, ...updatedFields } = req.body;
                const result = await skillsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedFields }
                );
                if (result.matchedCount) {
                    res.status(200).json({
                        success: true,
                        message: "Skill updated successfully",
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        error: "Skill not found or couldn't be updated",
                    });
                }
            } catch (error) {
                console.error("Error updating service:", error);
                res.status(500).json({
                    success: false,
                    error: "Internal server error",
                });
            }
        });


        //delete a Skill
        app.delete('/skills/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const result = await skillsCollection.deleteOne({
                    _id: new ObjectId(id)
                });
                if (result.deletedCount) {
                    res.send({
                        success: true,
                        message: 'Skill deleted successfully.'
                    });
                }
                else {
                    res.send({
                        success: false,
                        error: "Couldn't delete the Skill",
                    });
                }
            }
            catch (error) {
                console.error(error.name, error.message);
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })



    } finally {
        console.log("Operation is done.")
    }
}
run().catch(console.dir);



app.get('/', async (req, res) => {
    res.send('portfolio Server is Running');
})

app.listen(port, () => console.log(`Portfolio Server running on port: ${port}`))