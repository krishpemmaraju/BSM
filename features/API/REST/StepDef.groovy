import io.cucumber.groovy.PendingException

import static io.cucumber.groovy.Hooks.*
import static io.cucumber.groovy.EN.*

When(~/^user query the employee information with id as "([^"]*)"$/) { String arg1 ->
    // Write code here that turns the phrase above into concrete actions
    throw new PendingException()
}