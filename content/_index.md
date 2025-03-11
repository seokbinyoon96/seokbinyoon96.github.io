---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "0.8rem"

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf
  - block: resume-experience
    id: experience
    content:
      username: admin
    design:
      # Hugo date format
      date_format: 'January 2006'
      # Education or Experience section first?
      is_education_first: false
  - block: collection
    id: publications
    content:
      title: Recent Publications
      text: "You can visit my [<u>Google Scholar profile here</u>](https://scholar.google.com/citations?hl=en&user=lRZCtLMAAAAJ) to see my publicly available publications. Details on previous research and academic projects can be found in the [<u>projects tab.</u>](/projects/research)"
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
  - block: resume-awards
    content:
      title: Awards
      date_format: '2006'
      username: admin
---
