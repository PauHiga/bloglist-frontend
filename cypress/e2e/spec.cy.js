describe('Blog app', function () {

  beforeEach(function(){
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', { username:'root', password:'sekret' })
    cy.visit('')
  })

  it('Login form is shown', () => {
    cy.get('#login-form').should('be.visible')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('.username-input').type('root')
      cy.get('.password-input').type('sekret')
      cy.contains('Login').click()
      cy.get('.message').contains('Successful login!')
    })

    it('fails with wrong credentials', function() {
      cy.get('.username-input').type('root')
      cy.get('.password-input').type('wrong password')
      cy.contains('Login').click()
      cy.get('.error-message').contains('Wrong username or password').should('have.css', { 'background-color':'rgb(185, 58, 36)' })
    })
  })

  describe('When logged in', function(){
    beforeEach(function(){
      cy.login({ username: 'root', password: 'sekret' })
    })

    it('a blog can be created', function(){
      cy.contains('Add New Blog').click()
      cy.get('#input-title').type('The new blog title')
      cy.get('#input-author').type('Mock Author')
      cy.get('#input-url').type('MockUrl')
      cy.contains('Create').click()
      cy.contains('The new blog title')
    })

    describe('and two blogs are created', function(){

      beforeEach(function(){
        cy.addBlog({ title:'First top blog', author:'me', url:'url1' })
        cy.addBlog({ title:'Second top blog', author:'me', url:'url2' })
      })

      it.only('the blog with more likes is displayed on top', function(){
        cy.contains('First top blog').parent().contains('Show details').click()
        cy.contains('Second top blog').parent().contains('Show details').click()
        cy.contains('First top blog').parent().contains('like').click()
        cy.contains('First top blog').parent().contains('Likes: 1')
        cy.get('.blog-box').eq(0).contains('First top blog')
        cy.contains('Second top blog').parent().contains('like').click()
        cy.contains('Second top blog').parent().contains('Likes: 1')
        cy.contains('Second top blog').parent().contains('like').click()
        cy.contains('Second top blog').parent().contains('Likes: 1')
        cy.get('.blog-box').eq(0).contains('Second top blog')
      })
    })

    describe('and a blog with zero likes is created', function(){

      beforeEach(function(){
        cy.addBlog({ title:'Blog with zero likes', author:'me', url:'zeroLikes' })
      })

      it('a new like can be added', function (){
        cy.contains('Show details').click()
        cy.contains('Likes: 0')
        cy.get('ul').contains('like').click()
        cy.contains('Likes: 1')
      })

      it('the blog can be deleted by the user who created it', function(){
        cy.contains('Show details').click()
        cy.contains('Delete blog').click()
        cy.get('.blog-box').should('not.exist')
      })

      it('if a new user logs in, this new user cannot erase the message created by root', function(){
        cy.contains('Logout').click()
        cy.request('POST', 'http://localhost:3003/api/users', { username: 'Not-Root', password: 'Secreto' })
        cy.login({ username: 'Not-Root', password: 'Secreto' })
        cy.contains('Show details').click()
        cy.contains('Delete blog').should('not.exist')
      })
    })
  })

})

