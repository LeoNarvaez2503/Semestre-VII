import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.core.structure.ScenarioBuilder
import scala.concurrent.duration._
import scala.util.Random

class ChatLoadSimulation extends Simulation {

  // ============================================================================
  // CONFIGURATION - EDIT THESE VALUES
  // ============================================================================
  
  // Backend URL
  val BASE_URL = "http://localhost:8080"
  val WS_URL = "ws://localhost:8080"
  
  // Admin credentials (from .env)
  val ADMIN_USER = "admin"
  val ADMIN_PASS = "admin123"
  
  // Room configuration
  val ROOM_PIN = "1234"
  // TODO: EDIT THIS - Set your test room ID here
  val TEST_ROOM_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  
  // ============================================================================
  // PROTOCOLS
  // ============================================================================

  val httpProtocol = http
    .baseUrl(BASE_URL)
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
    .userAgentHeader("ChatSeguro-LoadTest/1.0")
    .shareConnections()
    .disableWarmUp()
    .silentResources() // Ignore static resource requests

  val wsProtocol = http
    .baseUrl(BASE_URL)
    .wsBaseUrl(WS_URL)
    .acceptHeader("application/json")
    .userAgentHeader("ChatSeguro-LoadTest/1.0")
    .shareConnections()

// ============================================================================
  // DATA FEEDERS - Generate test data for each user
  // ============================================================================

  // 50 unique nicknames (one per simulated user)
  val nicknamesFeeder = (1 to 50).map { i =>
    Map(
      "nickname" -> s"LoadTest_User_$i",
      "userId" -> i.toString,
      "messageCount" -> "0"
    )
  }.circular

  // ============================================================================
  // SCENARIO 1: BURST - All 50 users connect simultaneously
  // ============================================================================
  
  val burstScenario: ScenarioBuilder = scenario("Scenario_01_Burst_50_Users")
    .feed(nicknamesFeeder)
    
    // Generate unique session ID for this virtual user
    .exec(session => {
      session
        .set("clientId", java.util.UUID.randomUUID().toString)
        .set("timestamp", System.currentTimeMillis().toString)
    })

    // Step 1: Join Room via REST API
    .exec(http("01_JoinRoom")
      .post("/api/rooms/join")
      .body(StringBody(
        s"""{"roomId":"$TEST_ROOM_ID","pin":"$ROOM_PIN","nickname":"$${nickname}"}"""
      ))
      .check(status.is(200))
      .check(jsonPath("$.success").is("true"))
      .check(jsonPath("$.roomUser.id").exists.saveAs("roomUserId"))
    )
    .pause(100.millis)

    // Step 2: Connect to WebSocket
    .exec(ws("02_WebSocketConnect")
      .connect(s"/ws/chat")
      .onConnected(
        exec(session => {
          println(s"[${session("nickname").as[String]}] Connected to WebSocket")
          session
        })
      )
    )
    .pause(200.millis)

    // Step 3: Send multiple messages in burst
    .repeat(10) { messageNum =>
      exec(ws(s"03_SendMessage_${messageNum + 1}")
        .sendText(
          s"""{"nickname":"$${nickname}","message":"Burst message ${messageNum + 1} from $${userId}","timestamp":$${timestamp}}"""
        )
      )
      .pause(100.millis, 300.millis)
    }

    // Step 4: Wait for messages to be processed
    .pause(2.seconds)

    // Step 5: Close WebSocket connection
    .exec(ws("04_WebSocketClose")
      .close
      .onClose(
        exec(session => {
          println(s"[${session("nickname").as[String]}] WebSocket closed")
          session
        })
      )
    )

  // ============================================================================
  // SCENARIO 2: RAMP-UP - Users gradually connect over 5 minutes
  // ============================================================================

  val rampUpScenario: ScenarioBuilder = scenario("Scenario_02_RampUp_50_Users")
    .feed(nicknamesFeeder)
    
    .exec(session => {
      session
        .set("clientId", java.util.UUID.randomUUID().toString)
        .set("timestamp", System.currentTimeMillis().toString)
    })

    // Join Room
    .exec(http("01_JoinRoom")
      .post("/api/rooms/join")
      .body(StringBody(
        s"""{"roomId":"$TEST_ROOM_ID","pin":"$ROOM_PIN","nickname":"$${nickname}"}"""
      ))
      .check(status.is(200))
      .check(jsonPath("$.success").is("true"))
    )
    .pause(100.millis)

    // Connect to WebSocket
    .exec(ws("02_WebSocketConnect")
      .connect(s"/ws/chat")
    )
    .pause(200.millis)

    // Send messages every 2 seconds for 1 minute (30 messages per user)
    .repeat(30) { messageNum =>
      exec(ws(s"03_SendMessage_${messageNum + 1}")
        .sendText(
          s"""{"nickname":"$${nickname}","message":"Ramp-up msg ${messageNum + 1} from $${userId}","timestamp":$${timestamp}}"""
        )
      )
      .pause(2.seconds)
    }

    // Close connection
    .exec(ws("04_WebSocketClose")
      .close
    )

  // ============================================================================
  // LOAD PROFILES - Define how users are injected
  // ============================================================================

  // Burst: 50 users connect instantly (within 10 seconds)
  val burstLoadProfile = rampUsers(50) during (10.seconds)

  // Ramp-up: 50 users gradually connect over 5 minutes
  val rampUpLoadProfile = rampUsers(50) during (5.minutes)

  // ============================================================================
  // SETUP - Choose which scenario to run
  // ============================================================================

  setUp(
    // ========== SCENARIO 1: BURST ==========
    // Uncomment to run burst test (all 50 users at once)
    burstScenario.inject(burstLoadProfile)
      .protocols(httpProtocol, wsProtocol)
      .maxDuration(2.minutes),
    
    // ========== SCENARIO 2: RAMP-UP ==========
    // Uncomment to run ramp-up test (gradual user connection)
    // rampUpScenario.inject(rampUpLoadProfile)
    //   .protocols(httpProtocol, wsProtocol)
    //   .maxDuration(10.minutes)

  ).assertions(
    // ========== SUCCESS CRITERIA ==========
    
    // Latency assertions (target: < 1 second per requirement)
    responseTime.max.lessThan(5000),
    responseTime.mean.lessThan(1000),
    responseTime.percentile(95).lessThan(2000),
    
    // Success rate (should have minimal errors)
    successfulRequests.percent.greaterThan(95),
    
    // Total requests should be > 0
    allRequests.count.greaterThan(0)
  )
}
