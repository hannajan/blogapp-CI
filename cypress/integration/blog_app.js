describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:8000/api/testing/reset')
    const user = {
      name: 'Testuser',
      username: 'test',
      password: 'secret'
    }
    const anotherUser = {
      name: 'Another user',
      username: 'another',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:8000/api/users/', user)
    cy.request('POST', 'http://localhost:8000/api/users/', anotherUser)
    cy.visit('http://localhost:8000')
  })

  it('login form is shown', function() {
    cy.get('form').should('contain', 'login')

    cy.get('#username').should('have.prop', 'type', 'text')
    cy.get('#password').should('have.prop', 'type', 'password')
  })

  describe('Login', function() {

    it('succeeds with correct credentials', function() {
      cy.intercept('/api/login*').as('login')
      cy.wait(4000)
      cy.get('#username').type('test')
      cy.get('#password').type('secret')
      cy.get('button').click()
      cy.wait('@login').its('response.statusCode').should('eq', 200)
      cy.contains('Testuser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('button').click()

      cy.get('.notification').should('contain', 'Wrong username or password!')
      cy.get('.notification').should('have.css', 'color', 'rgb(128, 128, 128)')

      cy.get('html').should('not.contain', 'Testuser logged in')
    })
  })

  /* describe('when logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('test')
      cy.get('#password').type('secret')
      cy.get('button').click()
    })

    it('a blog can be created', function() {
      cy.contains('create blog').click()

      cy.get('#title').type('My cypress test blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('docs.cypress.io')
      cy.get('#submit-button').click()

      cy.get('html').should('contain', 'My cypress test blog')
    })

    describe('when one blog exists', function() {
      beforeEach(function() {
        cy.contains('create blog').click()

        cy.get('#title').type('Cypress blog')
        cy.get('#author').type('Test Author')
        cy.get('#url').type('docs.cypress.io')
        cy.get('#submit-button').click()
      })

      it('a blog can be liked', function() {
        cy.contains('Cypress blog Test Author')
          .find('button')
          .click()

        cy.get('#like-button').click()
        cy.contains('likes 1')
      })

      it('a blog can be deleted by its creator', function() {
        cy.contains('Cypress blog Test Author')
          .find('button')
          .click()

        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'Cypress blog')
      })

      it('a blog cannot be removed by different user', function() {
        cy.contains('logout').click()
        cy.get('#username').type('another')
        cy.get('#password').type('salainen')
        cy.get('button').click()

        cy.contains('Cypress blog Test Author')
          .find('button')
          .click()

        cy.get('.fullBlogView').should('contain', 'Cypress blog')
        cy.get('.fullBlogView').should('not.contain', 'remove')
      })
    })

    describe('when some blogs exist', function() {
      beforeEach(function() {
        cy.contains('create blog').click()

        cy.get('#title').type('Blog 1')
        cy.get('#author').type('Author 1')
        cy.get('#url').type('www.1.fi')
        cy.get('#submit-button').click()

        cy.contains('create blog').click()

        cy.get('#title').type('Blog 2')
        cy.get('#author').type('Author 2')
        cy.get('#url').type('www.2.fi')
        cy.get('#submit-button').click()

        cy.contains('create blog').click()

        cy.get('#title').type('Blog 3')
        cy.get('#author').type('Author 3')
        cy.get('#url').type('www.3.fi')
        cy.get('#submit-button').click()
      })

      it('blogs are shown ordered by most liked', function() {
        cy.contains('Blog 1 Author 1').find('button').click()
        cy.contains('Blog 2 Author 2').find('button').click()
        cy.contains('Blog 3 Author 3').find('button').click()

        cy.get('.fullBlogView')
          .contains('Blog 2')
          .find('#like-button')
          .click()
          .then(() => {
            cy.get('.fullBlogView')
              .contains('Blog 3')
              .find('#like-button')
              .click()
              .then(() => {
                cy.get('.fullBlogView')
                  .contains('Blog 3')
                  .find('#like-button')
                  .click()
                  .then(() => {
                    cy.wait(3000)
                    cy.get('.fullBlogView').as('orderedArray')
                      .then(() => {
                        cy.get('@orderedArray').first().should('contain', 'Blog 3')
                        cy.get('@orderedArray').last()
                      })
                  })
              })
          })
      })
    })
  }) */
})