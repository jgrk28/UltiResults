import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class PostgreSQLJDBC {
	public static void main(String args[]) {
		Connection conn = null;
		try {
			Class.forName("org.postgresql.Driver");
			conn = DriverManager
				.getConnection("jdbc:postgresql://localhost:5432/postgres",
				"postgres", "localpassword");
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e.getClass().getName()+": "+e.getMessage());
			System.exit(0);
		}
		System.out.println("Opened database successfully");
      
		try {
			Statement st = conn.createStatement();
			ResultSet rs = st.executeQuery("SELECT * FROM tweets");
			while (rs.next())
			{
				System.out.println(rs.getString("tweet"));
			}
			rs.close();
			st.close();
		} catch (SQLException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		}  
	}
}
