const providerSchema =
{
    categories: [
        {
            descriptor: {
                code: "LANGUAGE-COURSES",
                name: "Language Courses"
            },
            id: "LANGUAGE-COURSES"
        },
        {
            id: "SKILL-DEVELOPMENT-COURSES",
            descriptor: {
                code: "SKILL-DEVELOPMENT-COURSES",
                name: "Skill development Courses"
            }
        },
    ],
    descriptor: {
        name: "Tarento - ",
        short_desc: "Tarento ",
        images: [
            {
                size_type: "sm",
                url: "https://sunbird.org/images/sunbird-logo-new.png"
            }
        ]
    },
    id: "Tarento",
    items: [
    ],
    fulfillments: [
        {
            agent: {
                person: {
                    name: ""
                },
                contact: {
                    email: ""
                }
            }
        }
    ]
}


const itemSchema = {
    // category_ids: [
    // ],
    // creator: {
    //     descriptor: {
    //         name: 'trainerLastName'
    //     }
    // },
    // descriptor: {
    //     long_desc: "Long description of the item",
    //     name: 'trainerFirstName',
    //     short_desc: "short desc"
    // },
    // display: true,
    // id: 'identifier',
    // price: {
    //     currency: "INR",
    //     value: "0"
    // },
    // quantity: {
    //     maximum: {
    //         count: 1
    //     }
    // },
    // rateable: true,
    // rating: "0",
    // tags: [
    //     {
    //         descriptor: {
    //             code: "content-metadata",
    //             name: "Content metadata"
    //         },
    //         list: [
    //             {
    //                 descriptor: {
    //                     code: "learner-level",
    //                     name: "Learner level"
    //                 },
    //                 value: "Beginner"
    //             },
    //             {
    //                 descriptor: {
    //                     code: "learning-objective",
    //                     name: "Learning objective"
    //                 },
    //                 value: "By the end of the course, learners will confidently navigate everyday conversations, demonstrating improved fluency, cultural awareness, and effective communication skills."
    //             }
    //         ]
    //     }
    // ]
    id: 'id',
    // id: 'descriptor.id',
    title: 'descriptor.name',
    description: 'descriptor.short_desc',
    trainerId: 'creator.id',
    trainerFirstName: 'creator.name',
    appIcon: [
      {
        key: 'descriptor.images[]+.url+',
      },
    ],
    posterImage: [
      {
        key: 'descriptor.images[]+.url',
      },
    ],
    'tags[]': [{ key: 'tags.list[].value' }],
}

const responsePath = 'responseData'


const urlConfig = {
    url: 'http://127.0.0.1:3022/response1.json',
    headers: {
      'Content-Type': 'application/json'
    }
  };
// const urlPath='http://127.0.0.1:3022/response1.json'

module.exports = { providerSchema, itemSchema, responsePath,urlConfig };
