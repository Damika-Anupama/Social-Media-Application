package com.pali.palindromebackend.util;

import org.junit.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for {@link JWTUtil}: token generation, subject extraction, and
 * validation. The {@code @Value}-injected secret/expiry fields are populated via
 * {@link ReflectionTestUtils} so the class is exercised in isolation, with no
 * Spring context or database required.
 */
public class JWTUtilTest {

    // A valid Base64 string (jjwt 0.9.1 Base64-decodes the HS256 signing key).
    private static final String SECRET = "c2VjcmV0LWtleS1mb3ItdGVzdGluZy1qd3QtcGFsaW5kcm9tZQ==";
    private static final String ONE_HOUR_MS = "3600000";

    private JWTUtil newUtil(String secret, String expiryMs) {
        JWTUtil util = new JWTUtil();
        ReflectionTestUtils.setField(util, "SECRET_KEY", secret);
        ReflectionTestUtils.setField(util, "EXPIRE_TIME", expiryMs);
        return util;
    }

    private UserDetails userNamed(String username) {
        return new User(username, "n/a", Collections.emptyList());
    }

    @Test
    public void generatesTokenAndExtractsSubject() {
        JWTUtil util = newUtil(SECRET, ONE_HOUR_MS);

        String token = util.generateToken(userNamed("alice"));

        assertNotNull("token should be generated", token);
        assertEquals("alice", util.extractUsername(token));
    }

    @Test
    public void validatesTokenForMatchingUser() {
        JWTUtil util = newUtil(SECRET, ONE_HOUR_MS);

        String token = util.generateToken(userNamed("alice"));

        assertTrue(util.validateToken(token, userNamed("alice")));
    }

    @Test
    public void rejectsTokenWhenUsernameDoesNotMatch() {
        JWTUtil util = newUtil(SECRET, ONE_HOUR_MS);

        String token = util.generateToken(userNamed("alice"));

        assertFalse(util.validateToken(token, userNamed("bob")));
    }
}
